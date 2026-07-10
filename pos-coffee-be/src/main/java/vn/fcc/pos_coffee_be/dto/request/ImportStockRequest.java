package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ImportStockRequest(
        String stockId,
        String itemName,
        String unit,

        @NotNull(message = "Số lượng không được để trống")
        @DecimalMin(value = "0.01", inclusive = true, message = "Số lượng phải lớn hơn 0")
        BigDecimal quantity,

        String reason
) {}