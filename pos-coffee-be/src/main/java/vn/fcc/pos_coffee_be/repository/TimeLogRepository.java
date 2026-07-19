package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.TimeLog;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {

    @Query("""
            SELECT t FROM TimeLog t
            WHERE t.clockInTime BETWEEN :from AND :to
            ORDER BY t.clockInTime ASC
            """)
    List<TimeLog> findAllInRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("""
            SELECT t FROM TimeLog t
            WHERE t.employee.id = :employeeId
              AND t.clockInTime BETWEEN :from AND :to
            ORDER BY t.clockInTime ASC
            """)
    List<TimeLog> findByEmployeeInRange(
            @Param("employeeId") Long employeeId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
