package vn.fcc.pos_coffee_be.service.impl;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import vn.fcc.pos_coffee_be.dto.request.CloseShiftRequestDTO;
import vn.fcc.pos_coffee_be.dto.response.ShiftStatusResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftsResponseDTO;
import vn.fcc.pos_coffee_be.entity.ShiftAssignment;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;
import vn.fcc.pos_coffee_be.entity.Shifts;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.repository.OrdersRepository;
import vn.fcc.pos_coffee_be.repository.ShiftAssignmentRepository;
import vn.fcc.pos_coffee_be.repository.ShiftsRepository;
import vn.fcc.pos_coffee_be.repository.UserRepository;
import vn.fcc.pos_coffee_be.service.IShiftsService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class ShiftsServiceImpl implements IShiftsService {

    private final ShiftsRepository shiftsRepository;
    private final UserRepository usersRepository;
    private final OrdersRepository ordersRepository;
    private final ShiftAssignmentRepository assignmentRepository;
    public ShiftsServiceImpl(ShiftsRepository shiftsRepository, UserRepository usersRepository, OrdersRepository ordersRepository, ShiftAssignmentRepository assignmentRepository) {
        this.shiftsRepository = shiftsRepository;
         this.usersRepository = usersRepository;
         this.ordersRepository = ordersRepository;
         this.assignmentRepository = assignmentRepository;
    }


    @Override
    public ShiftStatusResponse checkCurrentShift(String username) {

        User user = usersRepository.findByUsername(username)
                .orElseThrow();

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        ShiftAssignment assignment =
                assignmentRepository
                        .findByEmployeeUserIdAndWorkDate(user.getId(), today)
                        .orElse(null);

        if (assignment == null) {

            return new ShiftStatusResponse(
                    false,
                    false,
                    false,
                    "Hôm nay bạn không được phân ca."
            );
        }

        ShiftSlot slot = assignment.getSlot();

        if (now.isBefore(slot.getStartTime())
                || now.isAfter(slot.getEndTime())) {

            return new ShiftStatusResponse(
                    true,
                    false,
                    false,
                    "Chưa tới giờ làm hoặc ca đã kết thúc."
            );
        }

        boolean opened =
                shiftsRepository
                        .findByUserAndSlotAndStatus(user, slot, "OPEN")
                        .isPresent();

        return new ShiftStatusResponse(
                true,
                true,
                opened,
                opened
                        ? "Ca đang mở."
                        : "Đến giờ làm, vui lòng mở ca."
        );
    }

    @Override
    public Shifts save(Shifts shifts) {
        return shiftsRepository.save(shifts);
    }

    public ShiftsResponseDTO closeShift(CloseShiftRequestDTO request) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = usersRepository.findByUsername(username)
                .orElseThrow();

//        User user = usersRepository.findById(1L).orElseThrow();

        Shifts shift = shiftsRepository
                .findByUserAndStatus(user, "OPEN")
                .orElseThrow(() -> new RuntimeException("Không có ca đang mở"));
        BigDecimal cash = ordersRepository.getCashRevenue(shift.getId());
        BigDecimal qr = ordersRepository.getQrRevenue(shift.getId());

        shift.setTotalCashSystem(cash);
        shift.setTotalQrSystem(qr);
        shift.setActualCash(request.actualCash());
        shift.setCloseTime(LocalDateTime.now());
        shift.setStatus("CLOSED");

        return toResponseDTO(shiftsRepository.save(shift));
    }

    private ShiftsResponseDTO toResponseDTO(Shifts shifts) {
        return new ShiftsResponseDTO(
                shifts.getId(),
                shifts.getUser().getId(),
                shifts.getOpenTime(),
                shifts.getCloseTime(),
                shifts.getInitialCash(),
                shifts.getTotalCashSystem(),
                shifts.getTotalQrSystem(),
                shifts.getActualCash(),
                shifts.getStatus()
        );
    }
}
