package vn.fcc.pos_coffee_be.dto.response;

import java.time.LocalDateTime;

public record InventoryResponse(
        String id,
        String itemType,
        String categoryName,
        String itemName,
        String sizeName,
        Integer quantity,
        String unit,
        LocalDateTime lastUpdated
) {}