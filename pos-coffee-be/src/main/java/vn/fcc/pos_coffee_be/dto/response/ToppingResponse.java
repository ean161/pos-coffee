package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;

public record ToppingResponse(
        String toppingId,
        String name,
        BigDecimal price,
        Boolean status
) {}