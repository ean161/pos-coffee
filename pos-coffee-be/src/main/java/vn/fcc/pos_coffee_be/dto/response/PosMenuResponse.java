package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record PosMenuResponse(
        List<CategoryWithProducts> categories,
        List<ToppingResponse> toppings
) {
    public record CategoryWithProducts(
            String categoryId,
            String name,
            Boolean status,
            List<ProductWithVariants> products
    ) {}

    public record ProductWithVariants(
            String productId,
            String categoryId,
            String name,
            BigDecimal basePrice,
            Boolean status,
            List<VariantInfo> variants
    ) {}

    public record VariantInfo(
            String variantId,
            String sizeName,
            BigDecimal priceAdjustment,
            BigDecimal finalPrice
    ) {}
}
