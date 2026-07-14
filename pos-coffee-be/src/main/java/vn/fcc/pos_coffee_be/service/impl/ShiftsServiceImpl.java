package vn.fcc.pos_coffee_be.service.impl;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import vn.fcc.pos_coffee_be.dto.request.CloseShiftRequestDTO;
import vn.fcc.pos_coffee_be.dto.response.ShiftsResponseDTO;
import vn.fcc.pos_coffee_be.entity.Shifts;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.repository.OrdersRepository;
import vn.fcc.pos_coffee_be.repository.ShiftsRepository;
import vn.fcc.pos_coffee_be.repository.UserRepository;
import vn.fcc.pos_coffee_be.service.IShiftsService;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ShiftsServiceImpl implements IShiftsService {

    private final ShiftsRepository shiftsRepository;
    private final UserRepository usersRepository;
    private final OrdersRepository ordersRepository;
    public ShiftsServiceImpl(ShiftsRepository shiftsRepository, UserRepository usersRepository, OrdersRepository ordersRepository) {
        this.shiftsRepository = shiftsRepository;
         this.usersRepository = usersRepository;
         this.ordersRepository = ordersRepository;
    }



    @Override
    public Shifts save(Shifts shifts) {
        return shiftsRepository.save(shifts);
    }

    public ShiftsResponseDTO closeShift(CloseShiftRequestDTO request) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = usersRepository.findByUsername(username)
                .orElseThrow();

//        User user = usersRepository.findById(1L).orElseThrow();

        Shifts shift = shiftsRepository
                .findByUserAndStatus(user, "OPEN")
                .orElseThrow(() -> new RuntimeException("Không có ca đang mở"));
        BigDecimal cash = ordersRepository.getCashRevenue(shift.getId());
        BigDecimal qr = ordersRepository.getQrRevenue(shift.getId());

        shift.setTotalCashSystem(cash);
        shift.setTotalQrSystem(qr);
        shift.setActualCash(request.actualCash());
        shift.setCloseTime(LocalDateTime.now());
        shift.setStatus("CLOSED");

        return toResponseDTO(shiftsRepository.save(shift));
    }

    private ShiftsResponseDTO toResponseDTO(Shifts shifts) {
        return new ShiftsResponseDTO(
                shifts.getId(),
                shifts.getUser().getId(),
                shifts.getOpenTime(),
                shifts.getCloseTime(),
                shifts.getInitialCash(),
                shifts.getTotalCashSystem(),
                shifts.getTotalQrSystem(),
                shifts.getActualCash(),
                shifts.getStatus()
        );
    }
}
