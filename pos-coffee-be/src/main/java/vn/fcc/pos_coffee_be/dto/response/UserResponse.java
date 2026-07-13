package vn.fcc.pos_coffee_be.dto.response;

public record UserResponse(
        String id,
        String username,
        String fullName,
        String role
) {
}
