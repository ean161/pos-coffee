package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record OrderItemResponse(
        String id,
        String productId,
        String productName,
        String variantId,
        String variantName,
        String sizeName,
        BigDecimal unitPrice,
        Integer quantity,
        String sugarLevel,
        String iceLevel,
        BigDecimal lineTotal,
        BigDecimal toppingTotal,
        List<ToppingResponse> toppings
) {}
