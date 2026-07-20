package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ShiftCheckInRequest(
        @Size(max = 255)
        String note,

        @DecimalMin(value = "0.0", inclusive = true)
        @Digits(integer = 16, fraction = 2)
        BigDecimal initialCash
) {}