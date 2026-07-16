package vn.fcc.pos_coffee_be.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record RevenueStatsResponse(
        BigDecimal totalRevenue,
        Integer totalOrders,
        Integer totalItemsSold,
        List<ChartDataPointResponse> chartData
) {}