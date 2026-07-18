package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.request.ShiftAssignmentRequest;
import vn.fcc.pos_coffee_be.dto.response.ShiftAssignmentResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftSlotResponse;
import vn.fcc.pos_coffee_be.entity.Employee;
import vn.fcc.pos_coffee_be.entity.ShiftAssignment;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.exception.ConflictException;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.EmployeeRepository;
import vn.fcc.pos_coffee_be.repository.ShiftAssignmentRepository;
import vn.fcc.pos_coffee_be.repository.ShiftSlotRepository;
import vn.fcc.pos_coffee_be.repository.UserRepository;
import vn.fcc.pos_coffee_be.service.IShiftAssignmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class ShiftAssignmentServiceImpl implements IShiftAssignmentService {

    private static final DateTimeFormatter HHMM = DateTimeFormatter.ofPattern("HH:mm");

    private final ShiftSlotRepository slotRepository;
    private final ShiftAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ShiftSlotResponse> getActiveSlots() {
        return slotRepository.findByActiveTrueOrderByStartTimeAsc().stream()
                .map(this::toSlotResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShiftAssignmentResponse> getAssignmentsInRange(LocalDate from, LocalDate to) {
        List<ShiftAssignment> assignments = assignmentRepository.findByWorkDateBetween(from, to);
        Map<String, User> userCache = new HashMap<>();
        return assignments.stream()
                .map(a -> toAssignmentResponse(a, userCache))
                .toList();
    }

    @Override
    public ShiftAssignmentResponse assign(ShiftAssignmentRequest request) {
        ShiftSlot slot = slotRepository.findById(request.slotId())
                .orElseThrow(() -> new ResourceNotFoundException("Shift slot not found with id: " + request.slotId()));
        if (!slot.isActive()) {
            throw new ConflictException("Shift slot is inactive");
        }

        User user = userRepository.findById(request.employeeUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.employeeUserId()));

        if (employeeRepository.findByUserId(user.getId()).isEmpty()) {
            throw new ResourceNotFoundException("Employee profile not found for user: " + user.getUsername());
        }

        if (assignmentRepository.existsBySlot_IdAndEmployeeUserIdAndWorkDate(
                slot.getId(), user.getId(), request.workDate())) {
            throw new ConflictException("Nhân viên đã được xếp ca này trong ngày đã chọn");
        }

        List<ShiftAssignment> sameDayOthers = assignmentRepository.findOtherSlotsForEmployee(
                user.getId(), request.workDate(), slot.getId());
        if (hasOverlap(sameDayOthers, slot)) {
            throw new ConflictException("Nhân viên đã có ca khác trùng khung giờ trong ngày");
        }

        ShiftAssignment assignment = new ShiftAssignment();
        assignment.setSlot(slot);
        assignment.setEmployeeUserId(user.getId());
        assignment.setWorkDate(request.workDate());
        assignment.setNote(request.note());

        ShiftAssignment saved = assignmentRepository.save(assignment);
        Map<String, User> cache = new HashMap<>();
        cache.put(user.getId(), user);
        return toAssignmentResponse(saved, cache);
    }

    @Override
    public void remove(Long assignmentId) {
        ShiftAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shift assignment not found with id: " + assignmentId));
        assignmentRepository.delete(assignment);
    }

    private boolean hasOverlap(List<ShiftAssignment> existing, ShiftSlot candidate) {
        LocalTime from = candidate.getStartTime();
        LocalTime to = candidate.getEndTime();
        for (ShiftAssignment a : existing) {
            ShiftSlot other = a.getSlot();
            if (other.getStartTime().isBefore(to) && from.isBefore(other.getEndTime())) {
                return true;
            }
        }
        return false;
    }

    private ShiftSlotResponse toSlotResponse(ShiftSlot slot) {
        return new ShiftSlotResponse(
                slot.getId(),
                slot.getName(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.isActive()
        );
    }

    private ShiftAssignmentResponse toAssignmentResponse(ShiftAssignment assignment, Map<String, User> cache) {
        ShiftSlot slot = assignment.getSlot();
        User user = cache.computeIfAbsent(assignment.getEmployeeUserId(), id ->
                userRepository.findById(id).orElse(null));
        return new ShiftAssignmentResponse(
                assignment.getId(),
                slot.getId(),
                slot.getName(),
                slot.getStartTime().format(HHMM),
                slot.getEndTime().format(HHMM),
                assignment.getEmployeeUserId(),
                user != null ? user.getUsername() : null,
                user != null ? user.getFullName() : null,
                assignment.getWorkDate(),
                assignment.getNote()
        );
    }
}
