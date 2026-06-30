package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Surcharge;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SurchargeRepository extends JpaRepository<Surcharge, String> {
    List<Surcharge> findByStatusTrueAndStartTimeBeforeAndEndTimeAfter(LocalDateTime now1, LocalDateTime now2);
}