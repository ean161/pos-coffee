package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ShiftAssignmentRequest(
        @NotNull(message = "Slot is required")
        Long slotId,

        @NotBlank(message = "Employee user id is required")
        @Size(max = 36)
        String employeeUserId,

        @NotNull(message = "Work date is required")
        LocalDate workDate,

        @Size(max = 255)
        String note
) {
}
