package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.response.OrderItemResponse;
import vn.fcc.pos_coffee_be.dto.response.OrderResponse;
import vn.fcc.pos_coffee_be.dto.response.ToppingResponse;
import vn.fcc.pos_coffee_be.entity.Orders;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.OrderRepository;
import vn.fcc.pos_coffee_be.service.IStaffOrderService;
import vn.fcc.pos_coffee_be.service.IUserService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffOrderServiceImpl implements IStaffOrderService {

    private final OrderRepository orderRepository;
    private final IUserService userService;

    @Override
    public List<OrderResponse> getMyOrders() {
        String staffId = userService.getCurrentUser().getId();
        return orderRepository.findByUserIdOrderByOrderDateDesc(staffId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId) {
        Orders orders = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng: " + orderId));

        String currentUserId = userService.getCurrentUser().getId();
        if (!orders.getUser().getId().equals(currentUserId)) {
            throw new ResourceNotFoundException("Bạn không có quyền cập nhật đơn hàng này");
        }

        Orders saved = orderRepository.save(orders);
        return mapToResponse(saved);
    }

    private OrderResponse mapToResponse(Orders orders) {
        List<OrderItemResponse> itemResponses = orders.getItems().stream()
                .map(item -> {
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
                })
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
}
