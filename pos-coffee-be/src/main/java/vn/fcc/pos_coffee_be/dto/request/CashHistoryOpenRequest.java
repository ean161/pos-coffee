package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CashHistoryOpenRequest(
        @NotNull
        @DecimalMin(value = "0.00", inclusive = true)
        BigDecimal openAmount
) {}
