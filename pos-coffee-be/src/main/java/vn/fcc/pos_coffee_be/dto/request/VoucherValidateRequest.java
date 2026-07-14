package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record VoucherValidateRequest(
        @NotBlank(message = "Mã voucher không được để trống")
        String code,

        @NotNull(message = "Tổng tiền đơn hàng không được để trống")
        @PositiveOrZero(message = "Tổng tiền đơn hàng phải >= 0")
        BigDecimal orderTotal
) {}
