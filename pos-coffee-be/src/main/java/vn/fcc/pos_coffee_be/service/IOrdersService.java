package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.response.OrderDetailResponseDTO;
import vn.fcc.pos_coffee_be.dto.response.OrderHistoryResponseDTO;

import java.util.List;

public interface IOrdersService {
    List<OrderHistoryResponseDTO> getHistory();
    OrderDetailResponseDTO detail(Long id);
}
