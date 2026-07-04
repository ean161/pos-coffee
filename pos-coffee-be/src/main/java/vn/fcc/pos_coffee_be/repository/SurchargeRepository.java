package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Surcharge;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SurchargeRepository extends JpaRepository<Surcharge, String> {
    List<Surcharge> findByStatusTrueAndStartTimeBeforeAndEndTimeAfter(LocalDateTime now1, LocalDateTime now2);

    @Modifying
    @Query("UPDATE Surcharge s SET s.status = false WHERE s.status = true AND s.endTime <= :now")
    void updateExpiredSurcharges(@Param("now") LocalDateTime now);
}