package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.EmployeeCreateRequest;
import vn.fcc.pos_coffee_be.dto.request.EmployeeUpdateRequest;
import vn.fcc.pos_coffee_be.dto.request.UpdateHourlyWageRequest;
import vn.fcc.pos_coffee_be.dto.response.EmployeeResponse;
import vn.fcc.pos_coffee_be.service.IEmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final IEmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employeeService.createEmployee(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeUpdateRequest request) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/wage")
    public ResponseEntity<EmployeeResponse> updateHourlyWage(
            @PathVariable Long id,
            @Valid @RequestBody UpdateHourlyWageRequest request) {
        return ResponseEntity.ok(employeeService.updateHourlyWage(id, request));
    }
}
