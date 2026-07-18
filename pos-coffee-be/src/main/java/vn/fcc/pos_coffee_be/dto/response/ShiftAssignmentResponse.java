package vn.fcc.pos_coffee_be.dto.response;

import java.time.LocalDate;

public record ShiftAssignmentResponse(
        Long id,
        Long slotId,
        String slotName,
        String slotStartTime,
        String slotEndTime,
        String employeeUserId,
        String employeeUsername,
        String employeeFullName,
        LocalDate workDate,
        String note
) {
}
