package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Orders;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    @Query(
            value = """
                    SELECT o FROM Orders o
                    JOIN FETCH o.user u
                    WHERE (:keyword IS NULL
                           OR LOWER(o.invoiceNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))
                      AND (:paymentMethod IS NULL OR o.paymentMethod = :paymentMethod)
                      AND (:fromDate IS NULL OR o.orderDate >= :fromDate)
                      AND (:toDate IS NULL OR o.orderDate < :toDate)
                    """,
            countQuery = """
                    SELECT COUNT(o) FROM Orders o
                    JOIN o.user u
                    WHERE (:keyword IS NULL
                           OR LOWER(o.invoiceNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
                           OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))
                      AND (:paymentMethod IS NULL OR o.paymentMethod = :paymentMethod)
                      AND (:fromDate IS NULL OR o.orderDate >= :fromDate)
                      AND (:toDate IS NULL OR o.orderDate < :toDate)
                    """
    )
    Page<Orders> searchPaymentHistory(
            @Param("keyword") String keyword,
            @Param("paymentMethod") String paymentMethod,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
}
