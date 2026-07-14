package vn.fcc.pos_coffee_be.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.fcc.pos_coffee_be.dto.response.OrderDetailResponseDTO;
import vn.fcc.pos_coffee_be.dto.response.OrderHistoryResponseDTO;
import vn.fcc.pos_coffee_be.service.IOrdersService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrdersController {

    private final IOrdersService ordersService;
    public OrdersController(IOrdersService ordersService) {
        this.ordersService = ordersService;
    }

    @GetMapping("/history")
    public List<OrderHistoryResponseDTO> history() {
        return ordersService.getHistory();
    }
    @GetMapping("/{id}")
    public OrderDetailResponseDTO detail(@PathVariable Long id) {
        return ordersService.detail(id);
    }
}
