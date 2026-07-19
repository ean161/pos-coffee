package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftSlotRepository extends JpaRepository<ShiftSlot, Long> {

    List<ShiftSlot> findByWorkDateBetweenOrderByStartTimeAsc(LocalDate from, LocalDate to);

    List<ShiftSlot> findByActiveTrueOrderByStartTimeAsc();

    boolean existsByNameAndWorkDate(String name, LocalDate workDate);
}