package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;

public record InventoryStockResponse(
        String id,
        String itemName,
        BigDecimal quantity,
        String unit
) {}