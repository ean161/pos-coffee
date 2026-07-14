package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    org.springframework.data.domain.Page<Product> findByCategoryId(String categoryId, org.springframework.data.domain.Pageable pageable);

    List<Product> findByCategoryIdAndStatusTrueOrderByNameAsc(String categoryId);
}
