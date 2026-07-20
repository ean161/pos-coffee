package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.ShiftCheckInRequest;
import vn.fcc.pos_coffee_be.dto.request.ShiftCheckOutRequest;
import vn.fcc.pos_coffee_be.dto.response.ShiftStatusResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftsResponseDTO;
import vn.fcc.pos_coffee_be.service.IShiftsService;

@RestController
@RequestMapping("/api/v1/shifts")
@RequiredArgsConstructor
public class ShiftsController {

    private final IShiftsService shiftsService;

    @PostMapping("/check-in")
    @ResponseStatus(HttpStatus.CREATED)
    public ShiftsResponseDTO checkIn(@RequestBody(required = false) @Valid ShiftCheckInRequest request) {
        return shiftsService.checkIn(request);
    }

    @PutMapping("/check-out")
    public ShiftsResponseDTO checkOut(@RequestBody(required = false) @Valid ShiftCheckOutRequest request) {
        return shiftsService.checkOut(request);
    }

    @GetMapping("/status")
    public ShiftStatusResponse checkStatus() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return shiftsService.checkCurrentShift(username);
    }

    @GetMapping("/current")
    public ShiftsResponseDTO current() {
        return shiftsService.getCurrent().orElse(null);
    }
}