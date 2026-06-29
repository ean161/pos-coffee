package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductRequest(

        @NotBlank(message = "CategoryId không được để trống")
        String categoryId,

        @NotBlank(message = "Tên sản phẩm không được để trống")
        String name,

        @NotNull(message = "Giá không được để trống")
        BigDecimal basePrice
) {}
