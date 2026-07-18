package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.request.EmployeeCreateRequest;
import vn.fcc.pos_coffee_be.dto.request.EmployeeUpdateRequest;
import vn.fcc.pos_coffee_be.dto.request.UpdateHourlyWageRequest;
import vn.fcc.pos_coffee_be.dto.response.EmployeeResponse;

import java.util.List;

public interface IEmployeeService {

    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse getEmployeeById(Long id);

    EmployeeResponse createEmployee(EmployeeCreateRequest request);

    EmployeeResponse updateEmployee(Long id, EmployeeUpdateRequest request);

    void deleteEmployee(Long id);

    EmployeeResponse updateHourlyWage(Long id, UpdateHourlyWageRequest request);
}
