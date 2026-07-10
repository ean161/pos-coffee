package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.InventoryLog;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, String> {
    Page<InventoryLog> findByInventoryStockIdOrderByCreatedAtDesc(String stockId, Pageable pageable);
}