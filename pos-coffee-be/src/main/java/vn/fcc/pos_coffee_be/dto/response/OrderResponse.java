package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long orderId,
        String invoiceNumber,
        String userId,
        String userFullName,
        BigDecimal totalAmount,
        BigDecimal discountAmount,
        BigDecimal finalAmount,
        String paymentMethod,
        LocalDateTime orderDate,
        List<OrderItemResponse> items
) {}
