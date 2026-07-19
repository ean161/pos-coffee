package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PayrollDetailEntryResponse(
        Long timeLogId,
        Long employeeId,
        LocalDateTime clockInTime,
        LocalDateTime clockOutTime,
        BigDecimal totalHours,
        String status
) {
}
