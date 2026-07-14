package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.request.CreateOrderRequest;
import vn.fcc.pos_coffee_be.dto.request.OrderItemRequest;
import vn.fcc.pos_coffee_be.dto.request.VoucherValidateRequest;
import vn.fcc.pos_coffee_be.dto.response.OrderItemResponse;
import vn.fcc.pos_coffee_be.dto.response.OrderResponse;
import vn.fcc.pos_coffee_be.dto.response.PosMenuResponse;
import vn.fcc.pos_coffee_be.dto.response.ToppingResponse;
import vn.fcc.pos_coffee_be.dto.response.VoucherValidationResponse;
import vn.fcc.pos_coffee_be.entity.*;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.*;
import vn.fcc.pos_coffee_be.service.IPosOrderService;
import vn.fcc.pos_coffee_be.service.IUserService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PosOrderServiceImpl implements IPosOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final ToppingRepository toppingRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;
    private final IUserService userService;

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        User staff = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));

        Order order = new Order();
        order.setStaff(staff);
        order.setCustomerName(request.customerName());
        order.setCustomerPhone(request.customerPhone());
        order.setOrderType(request.orderType() != null ? request.orderType() : "AT_TABLE");
        order.setTableNumber(request.tableNumber());
        order.setPaymentMethod(request.paymentMethod() != null ? request.paymentMethod() : "CASH");
        order.setNotes(request.notes());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại: " + itemReq.productId()));

            ProductVariant variant = null;
            if (itemReq.variantId() != null) {
                variant = variantRepository.findById(itemReq.variantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Biến thể không tồn tại: " + itemReq.variantId()));
            }

            List<Topping> toppings = new ArrayList<>();
            if (itemReq.toppingIds() != null && !itemReq.toppingIds().isEmpty()) {
                for (String toppingId : itemReq.toppingIds()) {
                    toppingRepository.findById(toppingId).ifPresent(toppings::add);
                }
            }

            BigDecimal toppingPerUnit = toppings.stream()
                    .map(Topping::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal itemToppingTotal = toppingPerUnit.multiply(BigDecimal.valueOf(itemReq.quantity()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setVariant(variant);
            orderItem.setProductName(itemReq.productName());
            orderItem.setVariantName(itemReq.variantName());
            orderItem.setUnitPrice(itemReq.unitPrice());
            orderItem.setQuantity(itemReq.quantity());
            orderItem.setSizeName(itemReq.sizeName());
            orderItem.setSugarLevel(itemReq.sugarLevel());
            orderItem.setIceLevel(itemReq.iceLevel());
            orderItem.setLineTotal(itemReq.lineTotal());
            orderItem.setToppingTotal(itemToppingTotal);
            orderItem.setToppings(toppings);

            orderItems.add(orderItem);
            subtotal = subtotal.add(itemReq.lineTotal()).add(itemToppingTotal);
        }

        order.setItems(orderItems);
        order.setSubtotal(subtotal);

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.voucherCode() != null && !request.voucherCode().isBlank()) {
            VoucherValidationResponse validation = validateVoucherInternal(
                    request.voucherCode().trim().toUpperCase(), subtotal);
            if (!"OK".equals(validation.message())) {
                throw new RuntimeException(validation.message());
            }
            discountAmount = validation.discountAmount();
        }

        order.setDiscountAmount(discountAmount);
        order.setSurchargeAmount(BigDecimal.ZERO);
        order.setTotalAmount(subtotal.subtract(discountAmount).max(BigDecimal.ZERO));

        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PosMenuResponse getMenu() {
        List<Category> categories = categoryRepository.findByStatusTrueOrderByNameAsc();

        List<PosMenuResponse.CategoryWithProducts> categoryDtos = categories.stream()
                .map(category -> {
                    List<Product> products = productRepository.findByCategoryIdAndStatusTrueOrderByNameAsc(category.getId());
                    List<PosMenuResponse.ProductWithVariants> productDtos = products.stream()
                            .map(product -> {
                                List<ProductVariant> variants = variantRepository.findByProductId(product.getId());
                                List<PosMenuResponse.VariantInfo> variantInfos = variants.stream()
                                        .map(v -> new PosMenuResponse.VariantInfo(
                                                v.getId(),
                                                v.getSizeName(),
                                                v.getPriceAdjustment(),
                                                product.getBasePrice().add(v.getPriceAdjustment())))
                                        .toList();
                                return new PosMenuResponse.ProductWithVariants(
                                        product.getId(),
                                        category.getId(),
                                        product.getName(),
                                        product.getBasePrice(),
                                        product.getStatus(),
                                        variantInfos);
                            })
                            .toList();
                    return new PosMenuResponse.CategoryWithProducts(
                            category.getId(),
                            category.getName(),
                            category.getStatus(),
                            productDtos);
                })
                .toList();

        List<Topping> toppings = toppingRepository.findByStatusTrueOrderByNameAsc();
        List<ToppingResponse> toppingDtos = toppings.stream()
                .map(t -> new ToppingResponse(t.getId(), t.getName(), t.getPrice(), t.getStatus()))
                .toList();

        return new PosMenuResponse(categoryDtos, toppingDtos);
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherValidationResponse validateVoucher(VoucherValidateRequest request) {
        return validateVoucherInternal(request.code().trim().toUpperCase(), request.orderTotal());
    }

    private VoucherValidationResponse validateVoucherInternal(String code, BigDecimal orderTotal) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(code);
        if (voucherOpt.isEmpty()) {
            return rejected(code, "Mã voucher không tồn tại");
        }
        Voucher voucher = voucherOpt.get();

        if (!Boolean.TRUE.equals(voucher.getStatus())) {
            return rejected(code, "Voucher đã bị vô hiệu hóa");
        }
        if (voucher.getExpiryDate().isBefore(LocalDateTime.now())) {
            return rejected(code, "Voucher đã hết hạn");
        }
        if (orderTotal == null || orderTotal.compareTo(voucher.getMinOrderValue()) < 0) {
            return rejected(code,
                    "Đơn hàng chưa đạt giá trị tối thiểu " + formatVnd(voucher.getMinOrderValue()));
        }

        BigDecimal discountAmount = computeDiscount(voucher, orderTotal);

        return new VoucherValidationResponse(
                voucher.getCode(),
                voucher.getDiscountType(),
                voucher.getDiscountValue(),
                voucher.getMinOrderValue(),
                voucher.getMaxDiscount(),
                discountAmount,
                orderTotal.subtract(discountAmount).max(BigDecimal.ZERO),
                "OK"
        );
    }

    private BigDecimal computeDiscount(Voucher voucher, BigDecimal orderTotal) {
        BigDecimal raw;
        if ("PERCENT".equalsIgnoreCase(voucher.getDiscountType())) {
            raw = orderTotal.multiply(voucher.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (voucher.getMaxDiscount() != null && raw.compareTo(voucher.getMaxDiscount()) > 0) {
                raw = voucher.getMaxDiscount();
            }
        } else {
            raw = voucher.getDiscountValue();
        }
        if (raw.compareTo(orderTotal) > 0) {
            raw = orderTotal;
        }
        return raw.setScale(2, RoundingMode.HALF_UP);
    }

    private VoucherValidationResponse rejected(String code, String reason) {
        return new VoucherValidationResponse(
                code, null, null, null, null,
                BigDecimal.ZERO, BigDecimal.ZERO, reason);
    }

    private String formatVnd(BigDecimal v) {
        if (v == null) return "0";
        return v.setScale(0, RoundingMode.HALF_UP).toPlainString();
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::mapToItemResponse)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStaff().getId(),
                order.getStaff().getFullName(),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getSubtotal(),
                order.getDiscountAmount(),
                order.getSurchargeAmount(),
                order.getTotalAmount(),
                order.getOrderType(),
                order.getTableNumber(),
                order.getPaymentMethod(),
                order.getStatus().name(),
                order.getNotes(),
                order.getCreatedAt(),
                itemResponses
        );
    }

    private OrderItemResponse mapToItemResponse(OrderItem item) {
        List<ToppingResponse> toppingResponses = item.getToppings().stream()
                .map(t -> new ToppingResponse(t.getId(), t.getName(), t.getPrice(), t.getStatus()))
                .toList();

        return new OrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProductName(),
                item.getVariant() != null ? item.getVariant().getId() : null,
                item.getVariantName(),
                item.getSizeName(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getSugarLevel(),
                item.getIceLevel(),
                item.getLineTotal(),
                item.getToppingTotal(),
                toppingResponses
        );
    }
}
