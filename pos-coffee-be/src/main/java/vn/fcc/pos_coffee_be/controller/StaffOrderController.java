package vn.fcc.pos_coffee_be.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.response.OrderResponse;
import vn.fcc.pos_coffee_be.service.IStaffOrderService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff/orders")
@RequiredArgsConstructor
public class StaffOrderController {

    private final IStaffOrderService staffOrderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        return ResponseEntity.ok(staffOrderService.getMyOrders());
    }

    @PatchMapping("/{orderId}")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long orderId) {
        return ResponseEntity.ok(staffOrderService.updateOrderStatus(orderId));
    }
}
