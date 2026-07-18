package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;

import java.util.List;

@Repository
public interface ShiftSlotRepository extends JpaRepository<ShiftSlot, Long> {
    List<ShiftSlot> findByActiveTrueOrderByStartTimeAsc();
}
