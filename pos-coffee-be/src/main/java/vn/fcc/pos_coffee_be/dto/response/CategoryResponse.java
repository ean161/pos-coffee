package vn.fcc.pos_coffee_be.dto.response;


public record CategoryResponse(
        String categoryId,
        String name,
        Boolean status
) {}
