package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.OrderItem;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StatisticRepository extends JpaRepository<OrderItem, String> {
    List<OrderItem> findByOrder_OrderDateGreaterThanEqual(LocalDateTime startDate);
}