package vn.fcc.pos_coffee_be.service;

import org.springframework.data.domain.Page;
import vn.fcc.pos_coffee_be.dto.response.RevenueStatsResponse;
import vn.fcc.pos_coffee_be.dto.response.TopProductResponse;

public interface IStatisticService {
    Page<TopProductResponse> getTopSellingProducts(int page, int size);
    RevenueStatsResponse getRevenueStats(String period, Integer year, Integer month);
}