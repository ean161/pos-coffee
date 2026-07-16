package vn.fcc.pos_coffee_be.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.response.*;
import vn.fcc.pos_coffee_be.service.IStatisticService;
import java.util.List;

@RestController
@RequestMapping("/api/v1/statistics")
public class StatisticController {

    private final IStatisticService statisticService;

    public StatisticController(IStatisticService statisticService) {
        this.statisticService = statisticService;
    }

    @GetMapping("/top-selling")
    public List<TopProductResponse> getTopSelling(@RequestParam(defaultValue = "10") int limit) {
        return statisticService.getTopSellingProducts(limit);
    }

    @GetMapping("/revenue")
    public ResponseEntity<RevenueStatsResponse> getRevenue(@RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(statisticService.getRevenueStats(period));
    }
}