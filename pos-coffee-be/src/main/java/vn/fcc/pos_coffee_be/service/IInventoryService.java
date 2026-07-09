package vn.fcc.pos_coffee_be.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.fcc.pos_coffee_be.dto.response.InventoryResponse;

import java.util.List;

public interface IInventoryService {
    Page<InventoryResponse> getCurrentInventory(String keyword, Pageable pageable);
}
