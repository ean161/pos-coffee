package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fcc.pos_coffee_be.entity.ProductVariants;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariants, String> {
    List<ProductVariants> findByProductId(String productId);
}