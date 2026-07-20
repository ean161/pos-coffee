package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Orders;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {

    @Query("""
        SELECT COALESCE(SUM(o.finalAmount), 0)
        FROM Orders o
        WHERE o.slot.id = :slotId
          AND o.paymentMethod = 'CASH'
    """)
    BigDecimal getCashRevenue(@Param("slotId") Long slotId);

    @Query("""
        SELECT COALESCE(SUM(o.finalAmount), 0)
        FROM Orders o
        WHERE o.slot.id = :slotId
          AND o.paymentMethod = 'QR_CODE'
    """)
    BigDecimal getQrRevenue(@Param("slotId") Long slotId);

    List<Orders> findBySlotOrderByOrderDateDesc(ShiftSlot slot);
}