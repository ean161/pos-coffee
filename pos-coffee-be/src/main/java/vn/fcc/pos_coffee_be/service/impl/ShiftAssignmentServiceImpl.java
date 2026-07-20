package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.request.ShiftAssignmentRequest;
import vn.fcc.pos_coffee_be.dto.request.ShiftSlotRequest;
import vn.fcc.pos_coffee_be.dto.response.ShiftAssignmentResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftSlotResponse;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class ShiftAssignmentServiceImpl implements IShiftAssignmentService {

    private static final DateTimeFormatter HHMM = DateTimeFormatter.ofPattern("HH:mm");

    private final ShiftSlotRepository slotRepository;
    private final ShiftAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    // ====================================================================
    //  SHIFT SLOT — CRUD (slot gắn liền 1 ngày workDate)
    // ====================================================================

    @Override
    @Transactional(readOnly = true)
    public List<ShiftSlotResponse> getSlotsInRange(LocalDate from, LocalDate to) {
        return slotRepository.findByWorkDateBetweenOrderByStartTimeAsc(from, to).stream()
                .map(this::toSlotResponse)
                .toList();
    }

    @Override
    public ShiftSlotResponse createSlot(ShiftSlotRequest req) {
        validateSlotTimes(req.startTime(), req.endTime());

        String name = req.name().trim();
        LocalDate workDate = req.workDate();

        // Upsert: nếu đã có slot (name, workDate) thì cập nhật giờ/active,
        // tránh vi phạm uk_shift_slot_name_workdate khi FE click trùng cell.
        ShiftSlot slot = slotRepository.findByNameAndWorkDate(name, workDate)
                .orElseGet(() -> {
                    ShiftSlot s = new ShiftSlot();
                    s.setName(name);
                    s.setWorkDate(workDate);
                    return s;
                });

        slot.setStartTime(req.startTime());
        slot.setEndTime(req.endTime());
        slot.setActive(req.active() == null || req.active());

        return toSlotResponse(slotRepository.save(slot));
    }

    @Override
    public ShiftSlotResponse updateSlot(Long id, ShiftSlotRequest req) {
        ShiftSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift slot not found with id: " + id));
        validateSlotTimes(req.startTime(), req.endTime());

        slot.setName(req.name().trim());
        slot.setStartTime(req.startTime());
        slot.setEndTime(req.endTime());
        slot.setWorkDate(req.workDate());
        if (req.active() != null) {
            slot.setActive(req.active());
        }
        return toSlotResponse(slotRepository.save(slot));
    }

    @Override
    public void deleteSlot(Long id) {
        ShiftSlot slot = slotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift slot not found with id: " + id));

        if (!assignmentRepository.findBySlot_Id(slot.getId()).isEmpty()) {
            throw new ConflictException("Không thể xóa slot đang được sử dụng bởi shift assignment. "
                    + "Hãy xóa các assignment trước hoặc set active=false.");
        }
        slotRepository.delete(slot);
    }

    @Override
    public List<ShiftSlotResponse> seedDefaultSlots(int days) {
        // Default 3 shifts mỗi ngày
        record Default(String name, LocalTime start, LocalTime end) {}
        List<Default> defaults = List.of(
                new Default("Sáng",  LocalTime.of(7, 0),  LocalTime.of(12, 0)),
                new Default("Chiều", LocalTime.of(12, 0), LocalTime.of(17, 0)),
                new Default("Tối",   LocalTime.of(17, 0), LocalTime.of(23, 59))
        );

        LocalDate start = LocalDate.now();
        int safeDays = Math.max(0, Math.min(days, 60));
        List<ShiftSlot> toSave = new ArrayList<>();

        for (int i = 0; i <= safeDays; i++) {
            LocalDate d = start.plusDays(i);
            for (Default def : defaults) {
                if (!slotRepository.existsByNameAndWorkDate(def.name(), d)) {
                    ShiftSlot slot = new ShiftSlot();
                    slot.setName(def.name());
                    slot.setStartTime(def.start());
                    slot.setEndTime(def.end());
                    slot.setWorkDate(d);
                    slot.setActive(true);
                    toSave.add(slot);
                }
            }
        }

        List<ShiftSlot> saved = slotRepository.saveAll(toSave);
        return saved.stream().map(this::toSlotResponse).toList();
    }

    private void validateSlotTimes(LocalTime start, LocalTime end) {
        if (start.equals(end)) {
            throw new ConflictException("Start time và end time không được bằng nhau");
        }
    }

    // ====================================================================
    //  SHIFT ASSIGNMENT — assign nhiều NV vào 1 slot của 1 ngày
    // ====================================================================

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
    public List<ShiftAssignmentResponse> assign(ShiftAssignmentRequest request) {
        ShiftSlot slot = slotRepository.findById(request.slotId())
                .orElseThrow(() -> new ResourceNotFoundException("Shift slot not found with id: " + request.slotId()));
        if (!slot.isActive()) {
            throw new ConflictException("Shift slot đang inactive, không thể xếp ca");
        }

        // Đảm bảo slot.workDate khớp với workDate trong request
        if (!slot.getWorkDate().equals(request.workDate())) {
            throw new ConflictException(
                    "Slot '" + slot.getName() + "' thuộc ngày " + slot.getWorkDate()
                            + ", không thể xếp cho ngày " + request.workDate());
        }

        Set<String> uniqueUserIds = new HashSet<>(request.employeeUserIds());
        List<User> users = userRepository.findAllById(uniqueUserIds);
        if (users.size() != uniqueUserIds.size()) {
            Set<String> foundIds = users.stream().map(User::getId).collect(java.util.stream.Collectors.toSet());
            Set<String> missing = new HashSet<>(uniqueUserIds);
            missing.removeAll(foundIds);
            throw new ResourceNotFoundException("Không tìm thấy user: " + missing);
        }

        List<ShiftAssignment> toSave = new ArrayList<>();

        for (User user : users) {
            if (employeeRepository.findByUserId(user.getId()).isEmpty()) {
                throw new ResourceNotFoundException(
                        "User '" + user.getUsername() + "' chưa có profile employee. Vui lòng tạo trước.");
            }
            if (assignmentRepository.existsBySlot_IdAndEmployeeUserIdAndWorkDate(
                    slot.getId(), user.getId(), request.workDate())) {
                throw new ConflictException(
                        "Nhân viên '" + user.getUsername() + "' đã được xếp ca '" + slot.getName()
                                + "' ngày " + request.workDate());
            }
            List<ShiftAssignment> others = assignmentRepository.findOtherSlotsForEmployee(
                    user.getId(), request.workDate(), slot.getId());
            if (hasOverlap(others, slot)) {
                throw new ConflictException(
                        "Nhân viên '" + user.getUsername() + "' đã có ca khác trùng khung giờ trong ngày "
                                + request.workDate());
            }

            ShiftAssignment a = new ShiftAssignment();
            a.setSlot(slot);
            a.setEmployeeUserId(user.getId());
            a.setWorkDate(request.workDate());
            a.setNote(request.note());
            toSave.add(a);
        }

        List<ShiftAssignment> saved = assignmentRepository.saveAll(toSave);
        Map<String, User> cache = new HashMap<>();
        for (User u : users) {
            cache.put(u.getId(), u);
        }
        List<ShiftAssignmentResponse> result = new ArrayList<>();
        for (ShiftAssignment a : saved) {
            result.add(toAssignmentResponse(a, cache));
        }
        return result;
    }

    @Override
    public void remove(Long assignmentId) {
        ShiftAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shift assignment not found with id: " + assignmentId));
        assignmentRepository.delete(assignment);
    }

    // ====================================================================
    //  HELPERS
    // ====================================================================

    private boolean hasOverlap(List<ShiftAssignment> existing, ShiftSlot candidate) {
        LocalTime from = candidate.getStartTime();
        LocalTime to = candidate.getEndTime();
        Long candidateSlotId = candidate.getId();
        for (ShiftAssignment a : existing) {
            ShiftSlot other = a.getSlot();
            // Bỏ qua assignment trỏ về cùng slot id (tránh false positive khi trùng khung giờ).
            if (other.getId() != null && other.getId().equals(candidateSlotId)) {
                continue;
            }
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
                slot.getWorkDate(),
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