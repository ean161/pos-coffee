package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.request.ShiftAssignmentRequest;
import vn.fcc.pos_coffee_be.dto.request.ShiftSlotRequest;
import vn.fcc.pos_coffee_be.dto.response.ShiftAssignmentResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftSlotResponse;

import java.time.LocalDate;
import java.util.List;

public interface IShiftAssignmentService {

    // ───── ShiftSlot CRUD (gắn liền 1 ngày) ─────
    List<ShiftSlotResponse> getSlotsInRange(LocalDate from, LocalDate to);

    ShiftSlotResponse createSlot(ShiftSlotRequest request);

    ShiftSlotResponse updateSlot(Long id, ShiftSlotRequest request);

    void deleteSlot(Long id);

    /** Idempotently seed default slots (Sáng/Chiều/Tối) for the next N days starting from today. */
    List<ShiftSlotResponse> seedDefaultSlots(int days);

    // ───── ShiftAssignment (assign nhiều NV) ─────
    List<ShiftAssignmentResponse> getAssignmentsInRange(LocalDate from, LocalDate to);

    List<ShiftAssignmentResponse> assign(ShiftAssignmentRequest request);

    void remove(Long assignmentId);
}