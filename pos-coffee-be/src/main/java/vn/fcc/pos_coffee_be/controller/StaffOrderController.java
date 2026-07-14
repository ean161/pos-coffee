package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String orderId,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        return ResponseEntity.ok(staffOrderService.updateOrderStatus(orderId, request.status()));
    }

    public record StatusUpdateRequest(
            @NotBlank(message = "Trạng thái không được để trống")
            @Size(max = 20, message = "Trạng thái không quá 20 ký tự")
            String status
    ) {}
}
