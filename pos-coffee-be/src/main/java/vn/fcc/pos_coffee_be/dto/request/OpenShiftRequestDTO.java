package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record OpenShiftRequestDTO(

        @NotNull
        @DecimalMin(value = "0.00", inclusive = true)
        BigDecimal initialCash
) {}
