package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.Size;

public record ShiftCheckOutRequest(
        @Size(max = 255)
        String note
) {}