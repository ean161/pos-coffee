package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.response.OrderResponse;

import java.util.List;

public interface IStaffOrderService {

    List<OrderResponse> getMyOrders();

    OrderResponse updateOrderStatus(Long orderId);
}
