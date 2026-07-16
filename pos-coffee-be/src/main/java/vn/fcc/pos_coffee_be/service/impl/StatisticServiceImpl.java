package vn.fcc.pos_coffee_be.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.fcc.pos_coffee_be.dto.response.*;
import vn.fcc.pos_coffee_be.entity.OrderItem;
import vn.fcc.pos_coffee_be.entity.Orders;
import vn.fcc.pos_coffee_be.repository.StatisticRepository;
import vn.fcc.pos_coffee_be.service.IStatisticService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticServiceImpl implements IStatisticService {

    private final StatisticRepository statisticRepository;

    public StatisticServiceImpl(StatisticRepository statisticRepository) {
        this.statisticRepository = statisticRepository;
    }

    @Override
    public Page<TopProductResponse> getTopSellingProducts(int page, int size) {
        List<TopProductResponse> allTopProducts = statisticRepository.findAll().stream()
                .collect(Collectors.groupingBy(OrderItem::getProductName, Collectors.summingLong(OrderItem::getQuantity)))
                .entrySet().stream()
                .map(e -> new TopProductResponse(e.getKey(), e.getValue()))
                .sorted((a, b) -> b.totalQuantitySold().compareTo(a.totalQuantitySold()))
                .toList();

        int start = page * size;
        int end = Math.min((start + size), allTopProducts.size());

        List<TopProductResponse> pageContent;
        if (start >= allTopProducts.size()) {
            pageContent = new ArrayList<>();
        } else {
            pageContent = allTopProducts.subList(start, end);
        }

        Pageable pageable = PageRequest.of(page, size);
        return new PageImpl<>(pageContent, pageable, allTopProducts.size());
    }

    @Override
    public RevenueStatsResponse getRevenueStats(String period, Integer year, Integer month) {
        LocalDateTime startDate;
        LocalDateTime endDate;
        boolean isGroupByMonth = false;

        if (year != null) {
            if (month != null && month >= 1 && month <= 12) {
                startDate = LocalDateTime.of(year, month, 1, 0, 0, 0);
                endDate = startDate.plusMonths(1);
                isGroupByMonth = false;
            } else {
                startDate = LocalDateTime.of(year, 1, 1, 0, 0, 0);
                endDate = startDate.plusYears(1);
                isGroupByMonth = true;
            }
        } else {
            String cleanPeriod = (period != null) ? period.toLowerCase().trim() : "7days";
            endDate = LocalDateTime.now().toLocalDate().plusDays(1).atStartOfDay();

            startDate = switch (cleanPeriod) {
                case "7days" -> LocalDateTime.now().minusDays(7).toLocalDate().atStartOfDay();
                case "month" -> LocalDateTime.now().withDayOfMonth(1).toLocalDate().atStartOfDay();
                case "quarter" -> {
                    int currentMonth = LocalDateTime.now().getMonthValue();
                    int firstMonthOfQuarter = ((currentMonth - 1) / 3) * 3 + 1;
                    yield LocalDateTime.now().withMonth(firstMonthOfQuarter).withDayOfMonth(1).toLocalDate().atStartOfDay();
                }
                case "year" -> {
                    isGroupByMonth = true;
                    yield LocalDateTime.now().withDayOfYear(1).toLocalDate().atStartOfDay();
                }
                default -> LocalDateTime.now().minusDays(7).toLocalDate().atStartOfDay();
            };
        }

        List<OrderItem> items = statisticRepository.findByOrder_OrderDateBetween(startDate, endDate);

        Set<Orders> uniqueOrders = items.stream()
                .map(OrderItem::getOrder)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        BigDecimal totalRevenue = uniqueOrders.stream()
                .map(o -> o.getFinalAmount() != null ? o.getFinalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItemsSold = items.stream().mapToInt(OrderItem::getQuantity).sum();

        final boolean finalIsGroupByMonth = isGroupByMonth;

        String datePattern = finalIsGroupByMonth ? "MM/yyyy" : "dd/MM";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(datePattern);

        Map<String, BigDecimal> aggregatedMap = uniqueOrders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().format(formatter),
                        TreeMap::new,
                        Collectors.mapping(
                                order -> order.getFinalAmount() != null ? order.getFinalAmount() : BigDecimal.ZERO,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));

        List<ChartDataPointResponse> chartData = aggregatedMap.entrySet().stream()
                .map(entry -> new ChartDataPointResponse(
                        finalIsGroupByMonth ? "Tháng " + entry.getKey().substring(0, 2) : entry.getKey(),
                        entry.getValue()
                ))
                .collect(Collectors.toList());

        return new RevenueStatsResponse(totalRevenue, uniqueOrders.size(), totalItemsSold, chartData);
    }
}