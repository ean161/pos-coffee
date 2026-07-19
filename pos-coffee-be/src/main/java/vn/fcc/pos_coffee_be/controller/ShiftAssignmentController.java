package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.ShiftAssignmentRequest;
import vn.fcc.pos_coffee_be.dto.response.ShiftAssignmentResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftSlotResponse;
import vn.fcc.pos_coffee_be.service.IShiftAssignmentService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/shift-assignments")
@RequiredArgsConstructor
public class ShiftAssignmentController {

    private final IShiftAssignmentService service;

    @GetMapping("/slots")
    public ResponseEntity<List<ShiftSlotResponse>> getSlots() {
        return ResponseEntity.ok(service.getActiveSlots());
    }

    @GetMapping
    public ResponseEntity<List<ShiftAssignmentResponse>> getInRange(
            @RequestParam("from") LocalDate from,
            @RequestParam("to") LocalDate to) {
        return ResponseEntity.ok(service.getAssignmentsInRange(from, to));
    }

    @PostMapping
    public ResponseEntity<ShiftAssignmentResponse> assign(@Valid @RequestBody ShiftAssignmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.assign(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        service.remove(id);
        return ResponseEntity.noContent().build();
    }
}
