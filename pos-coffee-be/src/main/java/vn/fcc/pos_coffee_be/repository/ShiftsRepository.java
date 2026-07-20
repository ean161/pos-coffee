package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Shifts;
import vn.fcc.pos_coffee_be.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftsRepository extends JpaRepository<Shifts, Long> {

    Optional<Shifts> findFirstByUserAndStatusOrderByOpenTimeDesc(User user, String status);

    List<Shifts> findByUserAndOpenTimeBetweenOrderByOpenTimeDesc(
            User user,
            LocalDateTime from,
            LocalDateTime to
    );

    @Query("""
            SELECT s FROM Shifts s
            JOIN FETCH s.user u
            JOIN FETCH s.slot sl
            WHERE s.openTime BETWEEN :from AND :to
              AND s.closeTime IS NOT NULL
              AND s.status = vn.fcc.pos_coffee_be.entity.Shifts.STATUS_CHECKED_OUT
            ORDER BY s.openTime ASC
            """)
    List<Shifts> findAllCompletedInRange(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("""
            SELECT s FROM Shifts s
            JOIN FETCH s.user u
            JOIN FETCH s.slot sl
            WHERE u.id = :userId
              AND s.openTime BETWEEN :from AND :to
              AND s.closeTime IS NOT NULL
              AND s.status = vn.fcc.pos_coffee_be.entity.Shifts.STATUS_CHECKED_OUT
            ORDER BY s.openTime ASC
            """)
    List<Shifts> findByUserCompletedInRange(
            @Param("userId") String userId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}