package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;

public record VoucherValidationResponse(
        String code,
        String discountType,
        BigDecimal discountValue,
        BigDecimal minOrderValue,
        BigDecimal maxDiscount,
        BigDecimal discountAmount,
        BigDecimal finalAmount,
        String message
) {}
