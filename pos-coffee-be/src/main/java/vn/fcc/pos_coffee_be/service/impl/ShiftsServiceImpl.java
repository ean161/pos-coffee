package vn.fcc.pos_coffee_be.service.impl;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.request.ShiftCheckInRequest;
import vn.fcc.pos_coffee_be.dto.request.ShiftCheckOutRequest;
import vn.fcc.pos_coffee_be.dto.response.ShiftStatusResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftsResponseDTO;
import vn.fcc.pos_coffee_be.entity.ShiftAssignment;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;
import vn.fcc.pos_coffee_be.entity.Shifts;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.exception.ConflictException;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.ShiftAssignmentRepository;
import vn.fcc.pos_coffee_be.repository.ShiftsRepository;
import vn.fcc.pos_coffee_be.repository.UserRepository;
import vn.fcc.pos_coffee_be.service.IShiftsService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ShiftsServiceImpl implements IShiftsService {

    public static final String STATUS_CHECKED_IN = "CHECKED_IN";
    public static final String STATUS_CHECKED_OUT = "CHECKED_OUT";

    private final ShiftsRepository shiftsRepository;
    private final UserRepository usersRepository;
    private final ShiftAssignmentRepository assignmentRepository;

    public ShiftsServiceImpl(ShiftsRepository shiftsRepository,
                             UserRepository usersRepository,
                             ShiftAssignmentRepository assignmentRepository) {
        this.shiftsRepository = shiftsRepository;
        this.usersRepository = usersRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Override
    @Transactional
    public ShiftsResponseDTO checkIn(ShiftCheckInRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Nếu đã có shift CHECKED_IN trong ngày → trả về luôn (idempotent),
        // tránh ghi đè closeTime sai ca hiện tại.
        Optional<Shifts> currentOpen = shiftsRepository
                .findByUserAndOpenTimeBetweenOrderByOpenTimeDesc(
                        user,
                        today.atStartOfDay(),
                        today.plusDays(1).atStartOfDay()
                )
                .stream()
                .filter(s -> STATUS_CHECKED_IN.equals(s.getStatus()))
                .findFirst();
        if (currentOpen.isPresent()) {
            return toResponse(currentOpen.get());
        }

        // Lấy assignment trong ngày, sort theo giờ bắt đầu slot (sáng → chiều → tối).
        List<ShiftAssignment> assignments = assignmentRepository
                .findByEmployeeUserIdAndWorkDateOrderBySlotStart(user.getId(), today);
        if (assignments.isEmpty()) {
            throw new ConflictException("Hôm nay bạn không được phân ca làm việc");
        }

        // Ưu tiên ca đang trong khung giờ (start ≤ now ≤ end). Nếu ngoài giờ
        // (vd. đang ở khoảng nghỉ giữa 2 ca), cho phép check-in sớm ca kế tiếp
        // (ca chưa bắt đầu gần nhất). Cuối cùng mới fallback về ca đầu tiên.
        ShiftAssignment assignment = assignments.stream()
                .filter(a -> {
                    ShiftSlot sl = a.getSlot();
                    return !now.isBefore(sl.getStartTime()) && !now.isAfter(sl.getEndTime());
                })
                .findFirst()
                .or(() -> assignments.stream()
                        .filter(a -> a.getSlot().getStartTime().isAfter(now))
                        .findFirst())
                .orElse(assignments.get(0));

        ShiftSlot slot = assignment.getSlot();

        // Cảnh báo ngoài khung giờ (slot.end có thể qua nửa đêm)
        long minutesFromStart = java.time.Duration.between(slot.getStartTime(), now).toMinutes();
        long minutesToEnd = java.time.Duration.between(now, slot.getEndTime()).toMinutes();
        boolean outOfWindow = minutesFromStart < -120 || minutesToEnd < -120;
        if (outOfWindow) {
            org.slf4j.LoggerFactory.getLogger(ShiftsServiceImpl.class)
                    .warn("Check-in ngoài khung giờ (±2h): user={}, slot={}-{}, now={}",
                            username, slot.getStartTime(), slot.getEndTime(), now);
        }

        Shifts shift = Shifts.builder()
                .user(user)
                .slot(slot)
                .openTime(LocalDateTime.now())
                .status(STATUS_CHECKED_IN)
                .note(request != null ? request.note() : null)
                .initialCash(request != null && request.initialCash() != null
                        ? request.initialCash()
                        : java.math.BigDecimal.ZERO)
                .build();

        return toResponse(shiftsRepository.save(shift));
    }

    @Override
    @Transactional
    public ShiftsResponseDTO checkOut(ShiftCheckOutRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));

        Shifts shift = shiftsRepository
                .findFirstByUserAndStatusOrderByOpenTimeDesc(user, STATUS_CHECKED_IN)
                .orElseThrow(() -> new ResourceNotFoundException("Bạn chưa check-in ca nào."));

        shift.setCloseTime(LocalDateTime.now());
        shift.setStatus(STATUS_CHECKED_OUT);
        if (request != null && request.note() != null) {
            shift.setNote(request.note());
        }

        return toResponse(shiftsRepository.save(shift));
    }

    @Override
    @Transactional(readOnly = true)
    public ShiftStatusResponse checkCurrentShift(String username) {
        User user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        List<ShiftAssignment> assignments = assignmentRepository
                .findByEmployeeUserIdAndWorkDateOrderBySlotStart(user.getId(), today);

        ShiftAssignment assignment = assignments.stream().findFirst().orElse(null);

        if (assignment == null) {
            return new ShiftStatusResponse(false, false, false,
                    "Hôm nay bạn không được phân ca làm việc.");
        }

        ShiftSlot slot = assignment.getSlot();

        boolean inShiftTime = !now.isBefore(slot.getStartTime()) && !now.isAfter(slot.getEndTime());

        boolean checkedIn = shiftsRepository
                .findByUserAndOpenTimeBetweenOrderByOpenTimeDesc(
                        user,
                        today.atStartOfDay(),
                        today.plusDays(1).atStartOfDay()
                )
                .stream()
                .anyMatch(s -> STATUS_CHECKED_IN.equals(s.getStatus()));

        String message;
        if (!inShiftTime) {
            message = "Chưa tới giờ làm hoặc ca đã kết thúc.";
        } else if (!checkedIn) {
            message = "Đến giờ làm, vui lòng check-in.";
        } else {
            message = "Đã check-in ca.";
        }

        return new ShiftStatusResponse(true, inShiftTime, checkedIn, message);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ShiftsResponseDTO> getCurrent() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return shiftsRepository
                .findFirstByUserAndStatusOrderByOpenTimeDesc(
                        usersRepository.findByUsername(username).orElse(null),
                        STATUS_CHECKED_IN
                )
                .map(this::toResponse);
    }

    private ShiftsResponseDTO toResponse(Shifts s) {
        return new ShiftsResponseDTO(
                s.getId(),
                s.getUser().getId(),
                s.getUser().getUsername(),
                s.getSlot().getId(),
                s.getSlot().getName(),
                s.getOpenTime(),
                s.getCloseTime(),
                s.getStatus(),
                s.getNote()
        );
    }
}