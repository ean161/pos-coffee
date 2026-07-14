package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        String orderId,
        String staffId,
        String staffName,
        String customerName,
        String customerPhone,
        BigDecimal subtotal,
        BigDecimal discountAmount,
        BigDecimal surchargeAmount,
        BigDecimal totalAmount,
        String orderType,
        String tableNumber,
        String paymentMethod,
        String status,
        String notes,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {}
