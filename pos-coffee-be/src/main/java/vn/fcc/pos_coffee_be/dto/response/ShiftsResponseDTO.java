package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;

public record ShiftsResponseDTO (Long id, String userId, java.time.LocalDateTime openTime, java.time.LocalDateTime closeTime, BigDecimal initialCash, BigDecimal totalCashSystem, BigDecimal totalQrSystem, BigDecimal actualCash, String status) {
}
