package vn.fcc.pos_coffee_be.dto.response;

import java.time.LocalTime;

public record ShiftSlotResponse(
        Long id,
        String name,
        LocalTime startTime,
        LocalTime endTime,
        boolean active
) {
}
