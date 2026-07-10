package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.request.ImportStockRequest;
import vn.fcc.pos_coffee_be.dto.request.ExportStockRequest; // Import mới
import vn.fcc.pos_coffee_be.dto.request.UpdateStockRequest;
import vn.fcc.pos_coffee_be.dto.response.InventoryLogResponse;
import vn.fcc.pos_coffee_be.dto.response.InventoryStockResponse;
import vn.fcc.pos_coffee_be.entity.InventoryLog;
import vn.fcc.pos_coffee_be.entity.InventoryStock;
import vn.fcc.pos_coffee_be.repository.InventoryLogRepository;
import vn.fcc.pos_coffee_be.repository.InventoryStockRepository;
import vn.fcc.pos_coffee_be.service.IInventoryStockService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InventoryStockServiceImpl implements IInventoryStockService {

    private final InventoryStockRepository inventoryStockRepository;
    private final InventoryLogRepository inventoryLogRepository;

    @Override
    public Page<InventoryStockResponse> getCurrentInventory(String keyword, Pageable pageable) {
        Page<InventoryStock> stockPage;

        if (keyword == null || keyword.isBlank()) {
            stockPage = inventoryStockRepository.findAll(pageable);
        } else {
            stockPage = inventoryStockRepository.findByItemNameContainingIgnoreCase(keyword, pageable);
        }

        return stockPage.map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void importStock(ImportStockRequest request) {
        InventoryStock stock;

        if (request.stockId() != null && !request.stockId().isBlank()) {
            stock = inventoryStockRepository.findById(request.stockId())
                    .orElseThrow(() -> new RuntimeException("Mặt hàng không tồn tại trong kho!"));
            stock.setQuantity(stock.getQuantity().add(request.quantity()));
        } else {
            if (request.itemName() == null || request.itemName().isBlank()) {
                throw new IllegalArgumentException("Tên hàng hóa mới không được để trống!");
            }
            stock = InventoryStock.builder()
                    .itemName(request.itemName())
                    .unit(request.unit())
                    .quantity(request.quantity())
                    .build();
        }

        stock = inventoryStockRepository.save(stock);

        InventoryLog log = InventoryLog.builder()
                .inventoryStock(stock)
                .logType("IMPORT")
                .quantity(request.quantity())
                .reason(request.reason())
                .createdAt(LocalDateTime.now())
                .build();

        inventoryLogRepository.save(log);
    }

    @Override
    @Transactional
    public void exportStock(ExportStockRequest request) {
        InventoryStock stock = inventoryStockRepository.findById(request.stockId())
                .orElseThrow(() -> new RuntimeException("Mặt hàng không tồn tại trong kho!"));

        if (stock.getQuantity().compareTo(request.quantity()) < 0) {
            throw new IllegalArgumentException("Số lượng tồn kho hiện tại không đủ để xuất! (Hiện có: "
                    + stock.getQuantity() + " " + stock.getUnit() + ")");
        }

        stock.setQuantity(stock.getQuantity().subtract(request.quantity()));
        inventoryStockRepository.save(stock);

        InventoryLog log = InventoryLog.builder()
                .inventoryStock(stock)
                .logType("EXPORT")
                .quantity(request.quantity())
                .reason(request.reason())
                .createdAt(LocalDateTime.now())
                .build();

        inventoryLogRepository.save(log);
    }

    @Override
    public Page<InventoryLogResponse> getStockLogs(String stockId, Pageable pageable) {
        return inventoryLogRepository.findByInventoryStockIdOrderByCreatedAtDesc(stockId, pageable)
                .map(log -> new InventoryLogResponse(
                        log.getId(),
                        log.getLogType(),
                        log.getQuantity(),
                        log.getReason(),
                        log.getCreatedAt()
                ));
    }

    @Override
    @Transactional
    public void updateStock(String id, UpdateStockRequest request) {
        InventoryStock stock = inventoryStockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mặt hàng không tồn tại trong kho!"));

        String reason = String.format("Cập nhật thông tin hệ thống: %s (%s %s) -> %s (%s %s)",
                stock.getItemName(), stock.getQuantity(), stock.getUnit(),
                request.itemName(), request.quantity(), request.unit());

        stock.setItemName(request.itemName());
        stock.setQuantity(request.quantity());
        stock.setUnit(request.unit());
        inventoryStockRepository.save(stock);

        InventoryLog log = InventoryLog.builder()
                .inventoryStock(stock)
                .logType("UPDATE")
                .quantity(request.quantity())
                .reason(reason)
                .createdAt(LocalDateTime.now())
                .build();
        inventoryLogRepository.save(log);
    }

    private InventoryStockResponse mapToResponse(InventoryStock stock) {
        return new InventoryStockResponse(
                stock.getId(),
                stock.getItemName(),
                stock.getQuantity(),
                stock.getUnit()
        );
    }
}