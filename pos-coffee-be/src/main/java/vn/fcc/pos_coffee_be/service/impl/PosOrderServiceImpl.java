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
import java.util.UUID;

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
    private final ShiftsRepository shiftsRepository;
    private final IUserService userService;

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        User user = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));

        Shifts shift = shiftsRepository
                .findFirstByUserAndStatusOrderByOpenTimeDesc(user, Shifts.STATUS_CHECKED_IN)
                .orElseThrow(() -> new ResourceNotFoundException("Bạn chưa check-in ca làm việc"));

        Orders orders = new Orders();
        orders.setInvoiceNumber(generateInvoiceNumber());
        orders.setUser(user);
        orders.setShift(shift);
        orders.setSlot(shift.getSlot());
        orders.setOrderDate(LocalDateTime.now());
        orders.setPaymentMethod(request.paymentMethod() != null ? request.paymentMethod() : "CASH");

        BigDecimal totalAmount = BigDecimal.ZERO;

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

            orders.addItem(orderItem);
            totalAmount = totalAmount.add(itemReq.lineTotal()).add(itemToppingTotal);
        }

        orders.setTotalAmount(totalAmount);

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.voucherCode() != null && !request.voucherCode().isBlank()) {
            VoucherValidationResponse validation = validateVoucherInternal(
                    request.voucherCode().trim().toUpperCase(), totalAmount);
            if (!"OK".equals(validation.message())) {
                throw new RuntimeException(validation.message());
            }
            discountAmount = validation.discountAmount();
        }

        orders.setDiscountAmount(discountAmount);
        orders.setFinalAmount(totalAmount.subtract(discountAmount).max(BigDecimal.ZERO));

        Orders saved = orderRepository.save(orders);
        return mapToResponse(saved);
    }

    private String generateInvoiceNumber() {
        return "INV-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
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

    private OrderResponse mapToResponse(Orders orders) {
        List<OrderItemResponse> itemResponses = orders.getItems().stream()
                .map(this::mapToItemResponse)
                .toList();

        return new OrderResponse(
                orders.getId(),
                orders.getInvoiceNumber(),
                orders.getUser().getId(),
                orders.getUser().getFullName(),
                orders.getTotalAmount(),
                orders.getDiscountAmount(),
                orders.getFinalAmount(),
                orders.getPaymentMethod(),
                orders.getOrderDate(),
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
