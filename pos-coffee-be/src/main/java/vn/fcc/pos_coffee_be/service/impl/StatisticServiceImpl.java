//package vn.fcc.pos_coffee_be.service.impl;
//
//import org.springframework.stereotype.Service;
//import vn.fcc.pos_coffee_be.dto.response.*;
//import vn.fcc.pos_coffee_be.entity.OrderItem;
//import vn.fcc.pos_coffee_be.repository.StatisticRepository;
//import vn.fcc.pos_coffee_be.service.IStatisticService;
//
//import java.time.LocalDateTime;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class StatisticServiceImpl implements IStatisticService {
//
//    private final StatisticRepository statisticRepository;
//
//    public StatisticServiceImpl(StatisticRepository statisticRepository) {
//        this.statisticRepository = statisticRepository;
//    }
//
//    @Override
//    public List<TopProductResponse> getTopSellingProducts(int limit) {
//        return statisticRepository.findAll().stream()
//                .collect(Collectors.groupingBy(OrderItem::getProductName, Collectors.summingLong(OrderItem::getQuantity)))
//                .entrySet().stream()
//                .map(e -> new TopProductResponse(e.getKey(), e.getValue()))
//                .sorted((a, b) -> b.totalQuantitySold().compareTo(a.totalQuantitySold()))
//                .limit(limit)
//                .toList();
//    }
//
//    @Override
//    public RevenueStatsResponse getRevenueStats(String period) {
//        LocalDateTime startDate = switch (period.toLowerCase()) {
//            case "year" -> LocalDateTime.now().withDayOfYear(1).toLocalDate().atStartOfDay();
//            case "quarter" -> LocalDateTime.now().minusMonths(3);
//            default -> LocalDateTime.now().withDayOfMonth(1).toLocalDate().atStartOfDay();
//        };
//
//        List<OrderItem> items = statisticRepository.findByOrder_OrderDateGreaterThanEqual(startDate);
//
//        // Tính doanh thu từ danh sách Order duy nhất (tránh đếm trùng tiền của 1 đơn hàng)
//        var uniqueOrders = items.stream()
//                .map(OrderItem::getOrder)
//                .filter(Objects::nonNull)
//                .collect(Collectors.toSet());
//
//        Double totalRevenue = uniqueOrders.stream()
//                .mapToDouble(o -> o .getFinalAmount() != null ? o.getFinalAmount().doubleValue() : 0.0)
//                .sum();
//
//        int totalItemsSold = items.stream().mapToInt(OrderItem::getQuantity).sum();
//
//        return new RevenueStatsResponse(totalRevenue, uniqueOrders.size(), totalItemsSold, new ArrayList<>());
//    }
//}