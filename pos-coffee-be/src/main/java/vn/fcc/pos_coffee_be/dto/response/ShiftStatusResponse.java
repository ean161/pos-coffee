package vn.fcc.pos_coffee_be.dto.response;

public record ShiftStatusResponse(
        boolean assigned,
        boolean inShiftTime,
        boolean checkedIn,
        String message
) {}