package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.response.OrderItemResponse;
import vn.fcc.pos_coffee_be.dto.response.OrderResponse;
import vn.fcc.pos_coffee_be.dto.response.ToppingResponse;
import vn.fcc.pos_coffee_be.entity.Order;
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
        return orderRepository.findByStaffIdOrderByCreatedAtDesc(staffId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng: " + orderId));

        String currentStaffId = userService.getCurrentUser().getId();
        if (!order.getStaff().getId().equals(currentStaffId)) {
            throw new ResourceNotFoundException("Bạn không có quyền cập nhật đơn hàng này");
        }

        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status);
        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
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
}
