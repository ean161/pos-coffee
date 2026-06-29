package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Page<Product> findByCategoryId(String categoryId, Pageable pageable);
}
