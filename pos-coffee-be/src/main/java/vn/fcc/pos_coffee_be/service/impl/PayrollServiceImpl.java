package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.request.UpdateTimeLogClockOutRequest;
import vn.fcc.pos_coffee_be.dto.response.PayrollDetailEntryResponse;
import vn.fcc.pos_coffee_be.dto.response.PayrollSummaryResponse;
import vn.fcc.pos_coffee_be.entity.Employee;
import vn.fcc.pos_coffee_be.entity.TimeLog;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.EmployeeRepository;
import vn.fcc.pos_coffee_be.repository.TimeLogRepository;
import vn.fcc.pos_coffee_be.service.IPayrollService;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    private final TimeLogRepository timeLogRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PayrollSummaryResponse> getSummary(LocalDate from, LocalDate to) {
        LocalDateTime fromDt = from.atStartOfDay();
        LocalDateTime toDt = to.atTime(LocalTime.MAX);
        List<TimeLog> logs = timeLogRepository.findAllInRange(fromDt, toDt);

        Map<Long, Aggregate> byEmployee = new HashMap<>();
        Map<Long, Employee> employeeCache = new HashMap<>();

        for (TimeLog log : logs) {
            if (!"VALID".equalsIgnoreCase(log.getStatus())) {
                continue;
            }
            Employee employee = log.getEmployee();
            employeeCache.putIfAbsent(employee.getId(), employee);

            BigDecimal hours = computeHours(log);
            if (hours.signum() <= 0) {
                continue;
            }

            Aggregate agg = byEmployee.computeIfAbsent(employee.getId(), id -> new Aggregate(employee));
            agg.totalHours = agg.totalHours.add(hours);
            agg.validShiftCount += 1;
        }

        return employeeCache.values().stream()
                .map(emp -> {
                    Aggregate agg = byEmployee.get(emp.getId());
                    BigDecimal totalHours = agg != null ? agg.totalHours : BigDecimal.ZERO;
                    int shifts = agg != null ? agg.validShiftCount : 0;
                    BigDecimal gross = totalHours.multiply(emp.getHourlyWage())
                            .setScale(2, RoundingMode.HALF_UP);
                    return toSummary(emp, totalHours.setScale(2, RoundingMode.HALF_UP), shifts, gross);
                })
                .sorted((a, b) -> b.grossSalary().compareTo(a.grossSalary()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollDetailEntryResponse> getDetail(Long employeeId, LocalDate from, LocalDate to) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        LocalDateTime fromDt = from.atStartOfDay();
        LocalDateTime toDt = to.atTime(LocalTime.MAX);
        List<TimeLog> logs = timeLogRepository.findByEmployeeInRange(employee.getId(), fromDt, toDt);
        return logs.stream().map(PayrollServiceImpl::toDetail).toList();
    }

    @Override
    public PayrollDetailEntryResponse updateClockOut(Long timeLogId, UpdateTimeLogClockOutRequest request) {
        TimeLog log = timeLogRepository.findById(timeLogId)
                .orElseThrow(() -> new ResourceNotFoundException("TimeLog not found with id: " + timeLogId));
        if (request.clockOutTime().isBefore(log.getClockInTime())) {
            throw new IllegalArgumentException("clockOutTime must be after clockInTime");
        }
        log.setClockOutTime(request.clockOutTime());
        log.setTotalHours(computeHours(log));
        if ("ABNORMAL".equalsIgnoreCase(log.getStatus()) && log.getClockOutTime() != null) {
            log.setStatus("VALID");
        }
        TimeLog saved = timeLogRepository.save(log);
        return toDetail(saved);
    }

    private static BigDecimal computeHours(TimeLog log) {
        if (log.getClockInTime() == null || log.getClockOutTime() == null) {
            return BigDecimal.ZERO;
        }
        long minutes = java.time.Duration.between(log.getClockInTime(), log.getClockOutTime()).toMinutes();
        if (minutes <= 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
    }

    private PayrollSummaryResponse toSummary(Employee employee, BigDecimal totalHours, int shifts, BigDecimal gross) {
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

    private static PayrollDetailEntryResponse toDetail(TimeLog log) {
        return new PayrollDetailEntryResponse(
                log.getId(),
                log.getEmployee().getId(),
                log.getClockInTime(),
                log.getClockOutTime(),
                computeHours(log),
                log.getStatus()
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
