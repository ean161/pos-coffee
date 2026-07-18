package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
        @NotNull(message = "Status is required")
        Boolean status
) {
}