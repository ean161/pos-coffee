package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.CreateOrderRequest;
import vn.fcc.pos_coffee_be.dto.request.VoucherValidateRequest;
import vn.fcc.pos_coffee_be.dto.response.OrderResponse;
import vn.fcc.pos_coffee_be.dto.response.PosMenuResponse;
import vn.fcc.pos_coffee_be.dto.response.VoucherValidationResponse;
import vn.fcc.pos_coffee_be.service.IPosOrderService;

@RestController
@RequestMapping("/api/v1/pos")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class PosOrderController {

    private final IPosOrderService posOrderService;

    @GetMapping("/menu")
    public ResponseEntity<PosMenuResponse> getMenu() {
        return ResponseEntity.ok(posOrderService.getMenu());
    }

    @PostMapping("/vouchers/validate")
    public ResponseEntity<VoucherValidationResponse> validateVoucher(
            @Valid @RequestBody VoucherValidateRequest request) {
        return ResponseEntity.ok(posOrderService.validateVoucher(request));
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(posOrderService.createOrder(request));
    }
}
