package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.response.PayrollDetailEntryResponse;
import vn.fcc.pos_coffee_be.dto.response.PayrollSummaryResponse;

import java.time.LocalDate;
import java.util.List;

public interface IPayrollService {
    List<PayrollSummaryResponse> getSummary(LocalDate from, LocalDate to);

    List<PayrollDetailEntryResponse> getDetail(Long employeeId, LocalDate from, LocalDate to);
}
