package vn.fcc.pos_coffee_be.dto.response;

public record TopProductResponse(
        String productName,
        Long totalQuantitySold
) {}