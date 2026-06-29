package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest (
        @NotBlank(message = "Tên danh mục không được để trống")
        String name
) {}