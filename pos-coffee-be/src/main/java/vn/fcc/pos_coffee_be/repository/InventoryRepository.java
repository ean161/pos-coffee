package vn.fcc.pos_coffee_be.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.fcc.pos_coffee_be.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, String> {
    Page<Inventory> findByProductVariantProductCategoryNameContainingOrProductVariantProductNameContainingOrToppingNameContaining(
            String categoryName, String productName, String toppingName, Pageable pageable);
}