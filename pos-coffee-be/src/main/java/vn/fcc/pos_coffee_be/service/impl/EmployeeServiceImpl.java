package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.request.EmployeeCreateRequest;
import vn.fcc.pos_coffee_be.dto.request.EmployeeUpdateRequest;
import vn.fcc.pos_coffee_be.dto.request.UpdateHourlyWageRequest;
import vn.fcc.pos_coffee_be.dto.response.EmployeeResponse;
import vn.fcc.pos_coffee_be.entity.Employee;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.exception.ConflictException;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.EmployeeRepository;
import vn.fcc.pos_coffee_be.repository.UserRepository;
import vn.fcc.pos_coffee_be.service.IEmployeeService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements IEmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return toResponse(employee);
    }

    @Override
    public EmployeeResponse createEmployee(EmployeeCreateRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new ConflictException("Username already exists: " + request.username());
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setRole(request.role());
        user.setStatus(request.status() != null ? request.status() : true);
        User savedUser = userRepository.save(user);

        Employee employee = new Employee();
        employee.setUserId(savedUser.getId());
        employee.setPhoneNumber(request.phoneNumber());
        employee.setHourlyWage(request.hourlyWage());
        employee.setHireDate(request.hireDate());

        Employee saved = employeeRepository.save(employee);
        return toResponse(saved, savedUser);
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeUpdateRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        employee.setPhoneNumber(request.phoneNumber());
        employee.setHourlyWage(request.hourlyWage());
        employee.setHireDate(request.hireDate());

        Employee updated = employeeRepository.save(employee);
        return toResponse(updated);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        User user = userRepository.findById(employee.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + employee.getUserId()));

        user.setStatus(false);
        userRepository.save(user);
    }

    @Override
    public EmployeeResponse updateHourlyWage(Long id, UpdateHourlyWageRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        employee.setHourlyWage(request.hourlyWage());
        Employee updated = employeeRepository.save(employee);
        return toResponse(updated);
    }

    private EmployeeResponse toResponse(Employee employee) {
        User user = userRepository.findById(employee.getUserId()).orElse(null);
        return toResponse(employee, user);
    }

    private EmployeeResponse toResponse(Employee employee, User user) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getUserId(),
                user != null ? user.getUsername() : null,
                user != null ? user.getFullName() : null,
                user != null ? user.getRole() : null,
                user != null ? user.getStatus() : null,
                employee.getPhoneNumber(),
                employee.getHourlyWage(),
                employee.getHireDate()
        );
    }
}
