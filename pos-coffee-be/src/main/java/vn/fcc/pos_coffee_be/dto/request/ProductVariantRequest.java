package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductVariantRequest(
        @NotBlank(message = "Tên size không được để trống (ví dụ: S, M, L)")
        String sizeName,

        @NotNull(message = "Giá chênh lệch không được để trống")
        BigDecimal priceAdjustment
) {
}