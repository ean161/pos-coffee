package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.CloseShiftRequestDTO;
import vn.fcc.pos_coffee_be.dto.request.OpenShiftRequestDTO;
import vn.fcc.pos_coffee_be.dto.response.ShiftsResponseDTO;
import vn.fcc.pos_coffee_be.entity.Shifts;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.repository.ShiftsRepository;
import vn.fcc.pos_coffee_be.repository.UserRepository;
import vn.fcc.pos_coffee_be.service.IShiftsService;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/shifts")
public class ShiftsController {
    private final IShiftsService shiftsService;
    private final UserRepository usersRepository;
    private final ShiftsRepository shiftsRepository;


    public ShiftsController(IShiftsService shiftsService, UserRepository usersRepository, ShiftsRepository shiftsRepository) {
        this.shiftsService = shiftsService;
        this.usersRepository = usersRepository;
        this.shiftsRepository = shiftsRepository;

    }


   @PostMapping(value = "/open")
   @ResponseStatus(HttpStatus.CREATED)
    public Shifts createShift(@RequestBody @Valid OpenShiftRequestDTO shifts) {

       String username = SecurityContextHolder.getContext()
               .getAuthentication()
               .getName();

       User user = usersRepository.findByUsername(username)
               .orElseThrow();

        Shifts shifts1 = new Shifts();
        shifts1.setUser(user);
        shifts1.setInitialCash(shifts.initialCash());
       shifts1.setOpenTime(LocalDateTime.now());
       shifts1.setStatus("OPEN");
        return shiftsService.save(shifts1);
    }
    @PutMapping("/close")
    public ShiftsResponseDTO closeShift(@RequestBody CloseShiftRequestDTO request) {
        return shiftsService.closeShift(request);
    }
    @GetMapping("/is-open")
    public ResponseEntity<Boolean> isShiftOpen() {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = usersRepository.findByUsername(username)
                .orElseThrow();

        boolean opened = shiftsRepository
                .findByUserAndStatus(user, "OPEN")
                .isPresent();

        return ResponseEntity.ok(opened);
    }

}
