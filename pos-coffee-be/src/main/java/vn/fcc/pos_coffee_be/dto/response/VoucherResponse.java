package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VoucherResponse(
        String id,
        String code,
        String discountType,
        BigDecimal discountValue,
        BigDecimal minOrderValue,
        BigDecimal maxDiscount,
        LocalDateTime expiryDate,
        Boolean status
) {}
