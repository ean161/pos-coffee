package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.response.RevenueStatsResponse;
import vn.fcc.pos_coffee_be.dto.response.TopProductResponse;
import java.util.List;

public interface IStatisticService {

    List<TopProductResponse> getTopSellingProducts(int limit);

    RevenueStatsResponse getRevenueStats(String period);
}