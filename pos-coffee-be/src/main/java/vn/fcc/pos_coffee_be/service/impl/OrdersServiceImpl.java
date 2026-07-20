package vn.fcc.pos_coffee_be.service.impl;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import vn.fcc.pos_coffee_be.dto.response.OrderDetailResponseDTO;
import vn.fcc.pos_coffee_be.dto.response.OrderHistoryResponseDTO;
import vn.fcc.pos_coffee_be.entity.Orders;
import vn.fcc.pos_coffee_be.entity.ShiftAssignment;
import vn.fcc.pos_coffee_be.entity.ShiftSlot;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.OrdersRepository;
import vn.fcc.pos_coffee_be.repository.ShiftAssignmentRepository;
import vn.fcc.pos_coffee_be.repository.UserRepository;
import vn.fcc.pos_coffee_be.service.IOrdersService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class OrdersServiceImpl implements IOrdersService {

    private final OrdersRepository ordersRepository;
    private final UserRepository usersRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;

    OrdersServiceImpl(OrdersRepository ordersRepository,
                      UserRepository usersRepository,
                      ShiftAssignmentRepository shiftAssignmentRepository) {
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.shiftAssignmentRepository = shiftAssignmentRepository;
    }

    public List<OrderHistoryResponseDTO> getHistory() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));

        ShiftSlot slot = shiftAssignmentRepository
                .findByEmployeeUserIdAndWorkDateOrderBySlotStart(user.getId(), LocalDate.now())
                .stream()
                .map(ShiftAssignment::getSlot)
                .filter(sl -> {
                    LocalTime now = LocalTime.now();
                    return !now.isBefore(sl.getStartTime()) && !now.isAfter(sl.getEndTime());
                })
                .findFirst()
                .or(() -> shiftAssignmentRepository
                        .findByEmployeeUserIdAndWorkDateOrderBySlotStart(user.getId(), LocalDate.now())
                        .stream()
                        .map(ShiftAssignment::getSlot)
                        .findFirst())
                .orElseThrow(() -> new ResourceNotFoundException("Hôm nay bạn không có ca làm việc"));

        return ordersRepository.findBySlotOrderByOrderDateDesc(slot)
                .stream()
                .map(this::toResponseHistoryDTO)
                .toList();
    }

    @Override
    public OrderDetailResponseDTO detail(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));
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