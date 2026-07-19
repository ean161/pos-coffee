package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.response.ShiftAssignmentResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftSlotResponse;
import vn.fcc.pos_coffee_be.dto.request.ShiftAssignmentRequest;

import java.time.LocalDate;
import java.util.List;

public interface IShiftAssignmentService {

    List<ShiftSlotResponse> getActiveSlots();

    List<ShiftAssignmentResponse> getAssignmentsInRange(LocalDate from, LocalDate to);

    ShiftAssignmentResponse assign(ShiftAssignmentRequest request);

    void remove(Long assignmentId);
}
