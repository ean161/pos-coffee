package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Orders;
import vn.fcc.pos_coffee_be.entity.Shifts;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {

    @Query("""
        SELECT COALESCE(SUM(o.finalAmount), 0)
        FROM Orders o
        WHERE o.shift.id = :shiftId
          AND o.paymentMethod = 'CASH'
    """)
    BigDecimal getCashRevenue(@Param("shiftId") Long shiftId);

    @Query("""
        SELECT COALESCE(SUM(o.finalAmount), 0)
        FROM Orders o
        WHERE o.shift.id = :shiftId
          AND o.paymentMethod = 'QR_CODE'
    """)
    BigDecimal getQrRevenue(@Param("shiftId") Long shiftId);

    List<Orders> findByShiftOrderByOrderDateDesc(Shifts shift);

    Optional<Orders> findById(Long id);
}
