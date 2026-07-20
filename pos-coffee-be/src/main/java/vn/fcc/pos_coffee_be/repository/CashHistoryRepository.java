package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.CashHistory;

import java.util.Optional;

@Repository
public interface CashHistoryRepository extends JpaRepository<CashHistory, Long> {

    boolean existsByStatus(String status);

    Optional<CashHistory> findFirstByStatusOrderByOpenTimeDesc(String status);
}
