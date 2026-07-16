package vn.fcc.pos_coffee_be.controller;

import org.springframework.data.domain.Page;
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
    public ResponseEntity<Page<TopProductResponse>> getTopSelling(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(statisticService.getTopSellingProducts(page, size));
    }

    @GetMapping("/revenue")
    public ResponseEntity<RevenueStatsResponse> getRevenue(
            @RequestParam(defaultValue = "7days", required = false) String period,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        return ResponseEntity.ok(statisticService.getRevenueStats(period, year, month));
    }
}