package vn.fcc.pos_coffee_be.dto.request;

import java.math.BigDecimal;

public record CloseShiftRequestDTO(
        BigDecimal actualCash
) {}
