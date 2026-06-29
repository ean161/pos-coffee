package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;

public record ProductResponse(
        String productId,
        String categoryId,
        String name,
        BigDecimal basePrice,
        Boolean status
) {}