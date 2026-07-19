package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EmployeeResponse(
        Long id,
        String userId,
        String username,
        String fullName,
        String role,
        Boolean userStatus,
        String phoneNumber,
        BigDecimal hourlyWage,
        LocalDateTime hireDate
) {
}
