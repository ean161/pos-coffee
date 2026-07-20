package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentHistoryResponse(
        Long orderId,
        String invoiceNumber,
        String staffName,
        LocalDateTime orderDate,
        BigDecimal totalAmount,
        BigDecimal discountAmount,
        BigDecimal finalAmount,
        String paymentMethod
) {}
