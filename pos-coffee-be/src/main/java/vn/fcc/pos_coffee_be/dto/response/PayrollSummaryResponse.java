package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;

public record PayrollSummaryResponse(
        Long employeeId,
        String employeeCode,
        String fullName,
        String username,
        String phoneNumber,
        int validShiftCount,
        BigDecimal totalHours,
        BigDecimal hourlyWage,
        BigDecimal grossSalary
) {
}
