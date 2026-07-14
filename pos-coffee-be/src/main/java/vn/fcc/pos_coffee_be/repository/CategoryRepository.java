package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Category;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {

    Page<Category> findByNameContainingIgnoreCase(String name, Pageable pageable);

    List<Category> findByStatusTrueOrderByNameAsc();
}
