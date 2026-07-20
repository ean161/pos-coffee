package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CashHistoryResponse(
        Long id,
        String userId,
        String username,
        LocalDateTime openTime,
        LocalDateTime closeTime,
        BigDecimal openAmount,
        BigDecimal closeAmount,
        String status
) {}
