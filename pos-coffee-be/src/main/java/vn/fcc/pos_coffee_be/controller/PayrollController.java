package vn.fcc.pos_coffee_be.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.UpdateTimeLogClockOutRequest;
import vn.fcc.pos_coffee_be.dto.response.PayrollDetailEntryResponse;
import vn.fcc.pos_coffee_be.dto.response.PayrollSummaryResponse;
import vn.fcc.pos_coffee_be.service.IPayrollService;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final IPayrollService payrollService;

    @GetMapping("/summary")
    public ResponseEntity<List<PayrollSummaryResponse>> getSummary(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(payrollService.getSummary(from, to));
    }

    @GetMapping("/detail")
    public ResponseEntity<List<PayrollDetailEntryResponse>> getDetail(
            @RequestParam("employeeId") Long employeeId,
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(payrollService.getDetail(employeeId, from, to));
    }

    @PatchMapping("/time-logs/{id}/clock-out")
    public ResponseEntity<PayrollDetailEntryResponse> updateClockOut(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTimeLogClockOutRequest request) {
        return ResponseEntity.ok(payrollService.updateClockOut(id, request));
    }

    @GetMapping("/summary/export")
    public void exportExcel(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            HttpServletResponse response) throws IOException {

        List<PayrollSummaryResponse> rows = payrollService.getSummary(from, to);

        String filename = URLEncoder.encode(
                "Bang-Luong-" + from + "_" + to + ".csv",
                StandardCharsets.UTF_8);

        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        try (PrintWriter writer = response.getWriter()) {
            writer.write("\uFEFF");
            writer.println("Mã NV,Họ tên,Tên đăng nhập,SĐT,Số ca hợp lệ,Tổng giờ,Lương/giờ,Thành tiền");
            for (PayrollSummaryResponse r : rows) {
                writer.println(String.join(",",
                        safe(r.employeeCode()),
                        safe(r.fullName()),
                        safe(r.username()),
                        safe(r.phoneNumber()),
                        String.valueOf(r.validShiftCount()),
                        format(r.totalHours()),
                        format(r.hourlyWage()),
                        format(r.grossSalary())
                ));
            }
        }
    }

    private static String safe(String value) {
        if (value == null) return "";
        String escaped = value.replace("\"", "\"\"");
        if (escaped.contains(",") || escaped.contains("\"") || escaped.contains("\n")) {
            return "\"" + escaped + "\"";
        }
        return escaped;
    }

    private static String format(java.math.BigDecimal value) {
        return value == null ? "0" : value.toPlainString();
    }
}
