package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderItemRequest(

        @NotBlank(message = "ID sản phẩm không được để trống")
        String productId,

        String variantId,

        @NotBlank(message = "Tên sản phẩm không được để trống")
        String productName,

        String variantName,

        @NotNull(message = "Đơn giá không được để trống")
        java.math.BigDecimal unitPrice,

        @NotNull(message = "Số lượng không được để trống")
        @Min(value = 1, message = "Số lượng phải lớn hơn 0")
        Integer quantity,

        @NotBlank(message = "Kích thước không được để trống")
        String sizeName,

        @NotBlank(message = "Mức đường không được để trống")
        String sugarLevel,

        @NotBlank(message = "Mức đá không được để trống")
        String iceLevel,

        @NotNull(message = "Thành tiền không được để trống")
        java.math.BigDecimal lineTotal,

        java.math.BigDecimal toppingTotal,

        List<String> toppingIds
) {}
