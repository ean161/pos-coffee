package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;

public record ProductVariantResponse(
        String variantId,
        String productId,
        String sizeName,
        BigDecimal priceAdjustment
) {}
