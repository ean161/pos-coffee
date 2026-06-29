package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import vn.fcc.pos_coffee_be.dto.request.ToppingRequest;
import vn.fcc.pos_coffee_be.dto.response.ToppingResponse;
import vn.fcc.pos_coffee_be.service.IToppingService;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/toppings")
@RequiredArgsConstructor
public class ToppingController {

    private final IToppingService toppingService;

    @GetMapping
    public ResponseEntity<Page<ToppingResponse>> getAllToppings(
            @PageableDefault(
                    size = 10,
                    sort = "id",
                    direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(
                toppingService.getAllToppings(pageable)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ToppingResponse> getById(
            @PathVariable String id) {
        return ResponseEntity.ok(
                toppingService.getToppingById(id)
        );
    }

    @PostMapping
    public ResponseEntity<ToppingResponse> createTopping(
            @Valid @RequestBody ToppingRequest request) {
        return new ResponseEntity<>(
                toppingService.createTopping(request),
                HttpStatus.CREATED
        );
    }

    @PatchMapping("/{id}/price")
    public ResponseEntity<ToppingResponse> updatePrice(
            @PathVariable String id,
            @RequestParam BigDecimal price) {
        return ResponseEntity.ok(
                toppingService.updateToppingPrice(id, price)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable String id,
            @RequestParam Boolean status) {
        toppingService.updateStatus(id, status);
        return ResponseEntity.noContent().build();
    }
}