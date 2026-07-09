package vn.fcc.pos_coffee_be.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.fcc.pos_coffee_be.dto.response.InventoryResponse;
import vn.fcc.pos_coffee_be.service.IInventoryService;

@RestController
@RequestMapping("/api/v1/inventories")
@RequiredArgsConstructor
public class InventoryController {

    private final IInventoryService inventoryService;

    @GetMapping
    public ResponseEntity<Page<InventoryResponse>> getCurrentInventory(
            @RequestParam(required = false) String keyword,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {

        Page<InventoryResponse> responsePage = inventoryService.getCurrentInventory(keyword, pageable);

        return ResponseEntity.ok(responsePage);
    }
}