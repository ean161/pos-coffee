package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Shifts;
import vn.fcc.pos_coffee_be.entity.User;

import java.util.Optional;

@Repository
public interface ShiftsRepository extends JpaRepository<Shifts, Long> {
    Optional<Shifts> findByUserAndStatus(User user, String status);
}
