package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ToppingRequest(
        @NotBlank(message = "Tên topping không được để trống")
        String name,
        @NotNull(message = "Giá topping không được để trống")
        BigDecimal price
) {}
