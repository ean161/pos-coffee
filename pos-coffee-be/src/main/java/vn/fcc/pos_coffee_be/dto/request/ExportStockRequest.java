package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ExportStockRequest(
        @NotBlank(message = "Stock ID không được để trống")
        String stockId,

        @NotNull(message = "Số lượng không được để trống")
        @DecimalMin(value = "0.01", inclusive = true, message = "Số lượng phải lớn hơn 0")
        BigDecimal quantity,

        String reason
) {}