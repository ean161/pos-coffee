package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record UpdateTimeLogClockOutRequest(
        @NotNull(message = "clockOutTime is required")
        LocalDateTime clockOutTime
) {
}
