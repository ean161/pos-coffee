package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public record ShiftSlotRequest(
        Long id,

        @NotBlank(message = "Slot name is required")
        @Size(max = 50)
        String name,

        @NotNull(message = "Start time is required")
        LocalTime startTime,

        @NotNull(message = "End time is required")
        LocalTime endTime,

        @NotNull(message = "Work date is required")
        LocalDate workDate,

        Boolean active
) {
}