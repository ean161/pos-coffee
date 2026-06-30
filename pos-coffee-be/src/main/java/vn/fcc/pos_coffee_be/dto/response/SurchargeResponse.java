package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SurchargeResponse(
        String id,
        String name,
        String surchargeType,
        BigDecimal value,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Boolean status
) {}
