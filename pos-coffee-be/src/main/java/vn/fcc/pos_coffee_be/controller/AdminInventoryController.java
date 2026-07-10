package vn.fcc.pos_coffee_be.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.ImportStockRequest;
import vn.fcc.pos_coffee_be.dto.request.ExportStockRequest; // Import mới
import vn.fcc.pos_coffee_be.dto.request.UpdateStockRequest;
import vn.fcc.pos_coffee_be.dto.response.InventoryLogResponse;
import vn.fcc.pos_coffee_be.dto.response.InventoryStockResponse;
import vn.fcc.pos_coffee_be.service.IInventoryStockService;

@RestController
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
public class AdminInventoryController {

    private final IInventoryStockService inventoryStockService;

    @GetMapping
    public ResponseEntity<Page<InventoryStockResponse>> getCurrentInventory(
            @RequestParam(required = false) String keyword,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        Page<InventoryStockResponse> responsePage = inventoryStockService.getCurrentInventory(keyword, pageable);

        return ResponseEntity.ok(responsePage);
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importStock(@RequestBody ImportStockRequest request) {
        inventoryStockService.importStock(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/export")
    public ResponseEntity<Void> exportStock(@RequestBody ExportStockRequest request) {
        inventoryStockService.exportStock(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{stockId}/logs")
    public ResponseEntity<Page<InventoryLogResponse>> getStockLogs(
            @PathVariable String stockId,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(inventoryStockService.getStockLogs(stockId, pageable));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Void> updateStock(@PathVariable String id, @RequestBody UpdateStockRequest request) {
        inventoryStockService.updateStock(id, request);
        return ResponseEntity.ok().build();
    }
}