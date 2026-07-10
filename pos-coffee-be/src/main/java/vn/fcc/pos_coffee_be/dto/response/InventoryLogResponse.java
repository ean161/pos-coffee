package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record InventoryLogResponse(
        String id,
        String logType,
        BigDecimal quantity,
        String reason,
        LocalDateTime createdAt
) {}