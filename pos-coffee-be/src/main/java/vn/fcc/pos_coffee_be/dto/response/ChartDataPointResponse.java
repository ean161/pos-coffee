package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;

public record ChartDataPointResponse(
        String name,
        BigDecimal revenue
) {}