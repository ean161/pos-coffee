package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderHistoryResponseDTO(

        Long id,
        String invoiceNumber,
        LocalDateTime orderDate,
        BigDecimal finalAmount

) {}
