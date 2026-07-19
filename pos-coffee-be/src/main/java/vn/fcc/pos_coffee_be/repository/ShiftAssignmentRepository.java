package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.ShiftAssignment;
import vn.fcc.pos_coffee_be.entity.Shifts;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, Long> {

    List<ShiftAssignment> findByWorkDateBetween(LocalDate from, LocalDate to);

    boolean existsBySlot_IdAndEmployeeUserIdAndWorkDate(Long slotId, String employeeUserId, LocalDate workDate);

    @Query("""
            SELECT a FROM ShiftAssignment a
            WHERE a.employeeUserId = :employeeUserId
              AND a.workDate = :workDate
              AND a.slot.id <> :excludeSlotId
            """)
    List<ShiftAssignment> findOtherSlotsForEmployee(
            @Param("employeeUserId") String employeeUserId,
            @Param("workDate") LocalDate workDate,
            @Param("excludeSlotId") Long excludeSlotId
    );
    Optional<ShiftAssignment> findByEmployeeUserIdAndWorkDate(
            String employeeUserId,
            LocalDate workDate
    );

}
