package vn.fcc.pos_coffee_be.dto.response;

public record AuthResponse(
        String token,
        String tokenType,
        UserResponse user
) {
}
