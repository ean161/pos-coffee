package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VoucherRequest(
        @NotBlank(message = "Mã voucher không được để trống")
        @Size(min = 3, max = 50, message = "Mã voucher từ 3 đến 50 ký tự")
        String code,

        @NotBlank(message = "Loại giảm giá không được để trống")
        String discountType, // PERCENT hoặc AMOUNT

        @NotNull(message = "Giá trị giảm không được để trống")
        @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị giảm phải lớn hơn 0")
        BigDecimal discountValue,

        @NotNull(message = "Giá trị đơn hàng tối thiểu không được để trống")
        @DecimalMin(value = "0.0", message = "Giá trị tối thiểu phải lớn hơn hoặc bằng 0")
        BigDecimal minOrderValue,

        BigDecimal maxDiscount,

        @NotNull(message = "Ngày hết hạn không được để trống")
        @Future(message = "Ngày hết hạn phải là một thời điểm trong tương lai")
        LocalDateTime expiryDate
) {}