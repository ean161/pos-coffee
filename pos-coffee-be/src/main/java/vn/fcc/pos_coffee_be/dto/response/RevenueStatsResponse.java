package vn.fcc.pos_coffee_be.dto.response;

import java.util.List;

public record RevenueStatsResponse(
        Double totalRevenue,
        Integer totalOrders,
        Integer totalItemsSold,
        List<ChartDataPointResponse> chartData
) {}