package vn.fcc.pos_coffee_be.service.impl;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import vn.fcc.pos_coffee_be.dto.response.OrderDetailResponseDTO;
import vn.fcc.pos_coffee_be.dto.response.OrderHistoryResponseDTO;
import vn.fcc.pos_coffee_be.entity.Orders;
import vn.fcc.pos_coffee_be.entity.Shifts;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.repository.OrdersRepository;
import vn.fcc.pos_coffee_be.repository.ShiftsRepository;
import vn.fcc.pos_coffee_be.repository.UserRepository;
import vn.fcc.pos_coffee_be.service.IOrdersService;

import java.util.List;

@Service
public class OrdersServiceImpl implements IOrdersService {

    private final OrdersRepository ordersRepository;
     private final UserRepository usersRepository;
     private final ShiftsRepository shiftsRepository;
     OrdersServiceImpl(OrdersRepository ordersRepository, UserRepository usersRepository, ShiftsRepository shiftsRepository) {
         this.ordersRepository = ordersRepository;
         this.usersRepository = usersRepository;
         this.shiftsRepository = shiftsRepository;
     }


    public List<OrderHistoryResponseDTO> getHistory() {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = usersRepository.findByUsername(username)
                .orElseThrow();


//        User user = usersRepository.findById(1L).orElseThrow();

        Shifts shift = shiftsRepository
                .findByUserAndStatus(user, "OPEN")
                .orElseThrow();

        return ordersRepository.findByShiftOrderByOrderDateDesc(shift)
                .stream()
                .map(this::toResponseHistoryDTO)
                .toList();
    }

    @Override
    public OrderDetailResponseDTO detail(Long id) {

        Orders order = ordersRepository.findById(id)
                .orElseThrow();

        return toResponseDetailDTO(order);
    }
    private OrderHistoryResponseDTO toResponseHistoryDTO(Orders orders) {
        return new OrderHistoryResponseDTO(
                orders.getId(),
                orders.getInvoiceNumber(),
                orders.getOrderDate(),
                orders.getFinalAmount()
        );
    }
    private OrderDetailResponseDTO toResponseDetailDTO(Orders orders) {
        return new OrderDetailResponseDTO(
                orders.getInvoiceNumber(),
                orders.getOrderDate(),
                orders.getTotalAmount(),
                orders.getDiscountAmount(),
                orders.getFinalAmount(),
                orders.getPaymentMethod()
        );
    }
}
