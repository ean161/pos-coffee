package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record UpdateHourlyWageRequest(
        @NotNull(message = "Hourly wage is required")
        @Positive(message = "Hourly wage must be positive")
        BigDecimal hourlyWage
) {
}
