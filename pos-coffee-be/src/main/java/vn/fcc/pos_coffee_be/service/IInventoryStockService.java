package vn.fcc.pos_coffee_be.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.fcc.pos_coffee_be.dto.request.ExportStockRequest;
import vn.fcc.pos_coffee_be.dto.request.ImportStockRequest;
import vn.fcc.pos_coffee_be.dto.request.UpdateStockRequest;
import vn.fcc.pos_coffee_be.dto.response.InventoryLogResponse;
import vn.fcc.pos_coffee_be.dto.response.InventoryStockResponse;

public interface IInventoryStockService {
    Page<InventoryStockResponse> getCurrentInventory(String keyword, Pageable pageable);
    void importStock(ImportStockRequest request);
    void exportStock(ExportStockRequest request);
    Page<InventoryLogResponse> getStockLogs(String stockId, Pageable pageable);
    void updateStock(String id, UpdateStockRequest request);
}