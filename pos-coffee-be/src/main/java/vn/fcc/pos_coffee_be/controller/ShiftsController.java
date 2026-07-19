package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.CloseShiftRequestDTO;
import vn.fcc.pos_coffee_be.dto.request.OpenShiftRequestDTO;
import vn.fcc.pos_coffee_be.dto.response.ShiftStatusResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftsResponseDTO;
import vn.fcc.pos_coffee_be.entity.ShiftAssignment;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;
import vn.fcc.pos_coffee_be.entity.Shifts;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.repository.ShiftAssignmentRepository;
import vn.fcc.pos_coffee_be.repository.ShiftsRepository;
import vn.fcc.pos_coffee_be.repository.UserRepository;
import vn.fcc.pos_coffee_be.service.IShiftsService;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/shifts")
public class ShiftsController {
    private final IShiftsService shiftsService;
    private final UserRepository usersRepository;
    private final ShiftsRepository shiftsRepository;
    private final ShiftAssignmentRepository assignmentRepository;


    public ShiftsController(IShiftsService shiftsService, UserRepository usersRepository, ShiftsRepository shiftsRepository, ShiftAssignmentRepository assignmentRepository) {
        this.shiftsService = shiftsService;
        this.usersRepository = usersRepository;
        this.shiftsRepository = shiftsRepository;
        this.assignmentRepository = assignmentRepository;

    }


    @PostMapping("/open")
    @ResponseStatus(HttpStatus.CREATED)
    public Shifts openShift(
            @RequestBody @Valid OpenShiftRequestDTO request
    ) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        ShiftStatusResponse status =
                shiftsService.checkCurrentShift(username);

        if (!status.assigned()) {
            throw new RuntimeException(status.message());
        }

        if (!status.inShiftTime()) {
            throw new RuntimeException(status.message());
        }

        User user = usersRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy nhân viên"));

        ShiftAssignment assignment =
                assignmentRepository
                        .findByEmployeeUserIdAndWorkDate(
                                user.getId(),
                                LocalDate.now()
                        )
                        .orElseThrow(() ->
                                new RuntimeException("Không tìm thấy ca làm"));

        ShiftSlot slot = assignment.getSlot();

        boolean openedToday =
                shiftsRepository.existsByUserAndSlotAndOpenTimeBetween(
                        user,
                        slot,
                        LocalDate.now().atStartOfDay(),
                        LocalDate.now().plusDays(1).atStartOfDay()
                );

        if (openedToday) {
            throw new RuntimeException(
                    "Bạn đã mở ca này hôm nay rồi."
            );
        }

        Shifts shift = new Shifts();

        shift.setUser(user);
        shift.setSlot(slot);
        shift.setInitialCash(request.initialCash());
        shift.setOpenTime(LocalDateTime.now());
        shift.setStatus("OPEN");

        return shiftsService.save(shift);
    }
    @PutMapping("/close")
    public ShiftsResponseDTO closeShift(
            @RequestBody CloseShiftRequestDTO request
    ) {

        return shiftsService.closeShift(request);
    }
    @GetMapping("/is-open")
    public ShiftStatusResponse checkCurrentShift() {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return shiftsService.checkCurrentShift(username);
    }


}
