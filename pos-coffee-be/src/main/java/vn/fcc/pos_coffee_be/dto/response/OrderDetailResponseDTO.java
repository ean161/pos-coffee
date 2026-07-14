package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderDetailResponseDTO(

        String invoiceNumber,
        LocalDateTime orderDate,
        BigDecimal totalAmount,
        BigDecimal discountAmount,
        BigDecimal finalAmount,
        String paymentMethod

) {}
