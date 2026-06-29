package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Topping;

@Repository
public interface ToppingRepository extends JpaRepository<Topping, String> {
}
