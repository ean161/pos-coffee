package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.response.PayrollDetailEntryResponse;
import vn.fcc.pos_coffee_be.dto.response.PayrollSummaryResponse;
import vn.fcc.pos_coffee_be.entity.Employee;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;
import vn.fcc.pos_coffee_be.entity.Shifts;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.EmployeeRepository;
import vn.fcc.pos_coffee_be.repository.ShiftsRepository;
import vn.fcc.pos_coffee_be.service.IPayrollService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class PayrollServiceImpl implements IPayrollService {

    private final ShiftsRepository shiftsRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PayrollSummaryResponse> getSummary(LocalDate from, LocalDate to) {
        LocalDateTime fromDt = from.atStartOfDay();
        LocalDateTime toDt = to.atTime(LocalTime.MAX);
        List<Shifts> shifts = shiftsRepository.findAllCompletedInRange(fromDt, toDt);

        Map<Long, Aggregate> byEmployee = new HashMap<>();
        Map<Long, Employee> employeeCache = new HashMap<>();

        for (Shifts shift : shifts) {
            User user = shift.getUser();
            Employee employee = resolveEmployee(user);
            if (employee == null) continue;
            employeeCache.putIfAbsent(employee.getId(), employee);

            BigDecimal hours = computeWorkedHours(shift);
            if (hours.signum() <= 0) continue;

            Aggregate agg = byEmployee.computeIfAbsent(employee.getId(),
                    id -> new Aggregate(employee));
            agg.totalHours = agg.totalHours.add(hours);
            agg.validShiftCount += 1;
        }

        return employeeCache.values().stream()
                .map(emp -> {
                    Aggregate agg = byEmployee.get(emp.getId());
                    BigDecimal totalHours = agg != null ? agg.totalHours : BigDecimal.ZERO;
                    int shiftCount = agg != null ? agg.validShiftCount : 0;
                    BigDecimal gross = totalHours.multiply(emp.getHourlyWage())
                            .setScale(2, RoundingMode.HALF_UP);
                    return toSummary(emp, totalHours.setScale(2, RoundingMode.HALF_UP),
                            shiftCount, gross);
                })
                .sorted((a, b) -> b.grossSalary().compareTo(a.grossSalary()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollDetailEntryResponse> getDetail(Long employeeId, LocalDate from, LocalDate to) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + employeeId));
        if (employee.getUser() == null) return List.of();

        LocalDateTime fromDt = from.atStartOfDay();
        LocalDateTime toDt = to.atTime(LocalTime.MAX);
        List<Shifts> shifts = shiftsRepository.findByUserCompletedInRange(
                employee.getUser().getId(), fromDt, toDt);
        return shifts.stream().map(s -> toDetail(employee, s)).toList();
    }

    /**
     * Rule:
     *  - check-in sớm: lấy slot.start (không phạt)
     *  - check-in trễ: lấy actualCheckIn
     *  - check-out sớm: lấy actualCheckOut
     *  - check-out trễ: lấy slot.end (không phạt)
     */
    private BigDecimal computeWorkedHours(Shifts shift) {
        if (shift.getCloseTime() == null) return BigDecimal.ZERO;

        ShiftSlot slot = shift.getSlot();
        if (slot == null) return BigDecimal.ZERO;

        LocalDateTime slotStart = slot.getWorkDate().atTime(slot.getStartTime());
        LocalDateTime slotEnd = slot.getWorkDate().atTime(slot.getEndTime());

        // slot end có thể qua nửa đêm (vd: 23:59 hôm nay → 00:00 hôm sau)
        if (!slotEnd.isAfter(slotStart)) {
            slotEnd = slotEnd.plusDays(1);
        }

        LocalDateTime effectiveStart = shift.getOpenTime().isBefore(slotStart)
                ? slotStart
                : shift.getOpenTime();
        LocalDateTime effectiveEnd = shift.getCloseTime().isAfter(slotEnd)
                ? slotEnd
                : shift.getCloseTime();

        long minutes = Duration.between(effectiveStart, effectiveEnd).toMinutes();
        if (minutes <= 0) return BigDecimal.ZERO;

        return BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
    }

    private Employee resolveEmployee(User user) {
        if (user == null) return null;
        return employeeRepository.findByUserId(user.getId()).orElse(null);
    }

    private PayrollSummaryResponse toSummary(Employee employee, BigDecimal totalHours,
                                              int shifts, BigDecimal gross) {
        User user = employee.getUser();
        return new PayrollSummaryResponse(
                employee.getId(),
                "NV" + String.format("%04d", employee.getId()),
                user != null ? user.getFullName() : null,
                user != null ? user.getUsername() : null,
                employee.getPhoneNumber(),
                shifts,
                totalHours,
                employee.getHourlyWage(),
                gross
        );
    }

    private PayrollDetailEntryResponse toDetail(Employee employee, Shifts shift) {
        ShiftSlot slot = shift.getSlot();
        BigDecimal workedHours = computeWorkedHours(shift);
        return new PayrollDetailEntryResponse(
                shift.getId(),
                employee.getId(),
                slot != null ? slot.getName() : null,
                shift.getOpenTime(),
                shift.getCloseTime(),
                workedHours,
                shift.getStatus()
        );
    }

    private static class Aggregate {
        BigDecimal totalHours = BigDecimal.ZERO;
        int validShiftCount = 0;
        final Employee employee;

        Aggregate(Employee employee) {
            this.employee = employee;
        }
    }
}
