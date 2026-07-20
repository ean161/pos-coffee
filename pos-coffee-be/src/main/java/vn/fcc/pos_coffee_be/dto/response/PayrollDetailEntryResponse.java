package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PayrollDetailEntryResponse(
        Long shiftId,
        Long employeeId,
        String slotName,
        LocalDateTime clockInTime,
        LocalDateTime clockOutTime,
        BigDecimal workedHours,
        String status
) {
}
