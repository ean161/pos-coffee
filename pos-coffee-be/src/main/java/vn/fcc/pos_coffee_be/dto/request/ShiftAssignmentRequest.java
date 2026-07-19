package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record ShiftAssignmentRequest(
        @NotNull(message = "Slot is required")
        Long slotId,

        @NotEmpty(message = "At least one employee is required")
        List<@NotBlank @Size(max = 36) String> employeeUserIds,

        @NotNull(message = "Work date is required")
        LocalDate workDate,

        @Size(max = 255)
        String note
) {
}