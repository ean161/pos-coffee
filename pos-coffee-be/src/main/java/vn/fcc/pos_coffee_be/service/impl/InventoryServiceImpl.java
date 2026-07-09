package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.fcc.pos_coffee_be.dto.response.InventoryResponse;
import vn.fcc.pos_coffee_be.entity.Inventory;
import vn.fcc.pos_coffee_be.repository.InventoryRepository;
import vn.fcc.pos_coffee_be.service.IInventoryService;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements IInventoryService {

    private final InventoryRepository inventoryRepository;

    @Override
    public Page<InventoryResponse> getCurrentInventory(String keyword, Pageable pageable) {
        Page<Inventory> inventoryPage;

        if (keyword == null || keyword.isBlank()) {
            inventoryPage = inventoryRepository.findAll(pageable);
        } else {
            inventoryPage = inventoryRepository
                    .findByProductVariantProductCategoryNameContainingOrProductVariantProductNameContainingOrToppingNameContaining(
                            keyword, keyword, keyword, pageable
                    );
        }

        return inventoryPage.map(this::mapToResponse);
    }

    private InventoryResponse mapToResponse(Inventory inventory) {
        String itemType;
        String itemName;
        String sizeName;
        String categoryName;

        if (inventory.getProductVariant() != null) {
            itemType = "PRODUCT";
            itemName = inventory.getProductVariant().getProduct().getName();
            sizeName = inventory.getProductVariant().getSizeName();
            categoryName = inventory.getProductVariant().getProduct().getCategory().getName();
        } else if (inventory.getTopping() != null) {
            itemType = "TOPPING";
            itemName = inventory.getTopping().getName();
            sizeName = "-";
            categoryName = "Topping";
        } else {
            itemType = "UNKNOWN";
            itemName = "Không xác định";
            sizeName = "-";
            categoryName = "-";
        }

        return new InventoryResponse(
                inventory.getId(),
                itemType,
                categoryName,
                itemName,
                sizeName,
                inventory.getQuantity(),
                inventory.getUnit(),
                inventory.getLastUpdated()
        );
    }
}