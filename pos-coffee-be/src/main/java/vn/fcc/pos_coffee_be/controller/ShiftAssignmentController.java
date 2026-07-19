package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.ShiftAssignmentRequest;
import vn.fcc.pos_coffee_be.dto.request.ShiftSlotRequest;
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

    // ───────── ShiftSlot CRUD (gắn liền 1 ngày) ─────────
    /** Lấy slot theo range ngày — mỗi slot thuộc đúng 1 ngày. */
    @GetMapping("/slots")
    public ResponseEntity<List<ShiftSlotResponse>> getSlots(
            @RequestParam("from") LocalDate from,
            @RequestParam("to") LocalDate to) {
        return ResponseEntity.ok(service.getSlotsInRange(from, to));
    }

    @PostMapping("/slots")
    public ResponseEntity<ShiftSlotResponse> createSlot(@Valid @RequestBody ShiftSlotRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createSlot(request));
    }

    @PutMapping("/slots/{slotId}")
    public ResponseEntity<ShiftSlotResponse> updateSlot(
            @PathVariable Long slotId,
            @Valid @RequestBody ShiftSlotRequest request) {
        return ResponseEntity.ok(service.updateSlot(slotId, request));
    }

    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long slotId) {
        service.deleteSlot(slotId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Seed default slots (Sáng/Chiều/Tối) cho N ngày tới (mặc định 7).
     * Idempotent: chỉ thêm slot chưa tồn tại theo (name, workDate).
     */
    @PostMapping("/slots/seed")
    public ResponseEntity<List<ShiftSlotResponse>> seedDefaultSlots(
            @RequestParam(value = "days", defaultValue = "7") int days) {
        return ResponseEntity.ok(service.seedDefaultSlots(days));
    }

    // ───────── ShiftAssignment ─────────
    @GetMapping
    public ResponseEntity<List<ShiftAssignmentResponse>> getInRange(
            @RequestParam("from") LocalDate from,
            @RequestParam("to") LocalDate to) {
        return ResponseEntity.ok(service.getAssignmentsInRange(from, to));
    }

    /** Assign nhiều NV vào 1 slot của 1 ngày (slot.workDate phải khớp workDate request). */
    @PostMapping
    public ResponseEntity<List<ShiftAssignmentResponse>> assign(@Valid @RequestBody ShiftAssignmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.assign(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        service.remove(id);
        return ResponseEntity.noContent().build();
    }
}