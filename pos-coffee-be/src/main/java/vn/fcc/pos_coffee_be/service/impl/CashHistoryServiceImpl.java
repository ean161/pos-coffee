package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.response.CashHistoryResponse;
import vn.fcc.pos_coffee_be.entity.CashHistory;
import vn.fcc.pos_coffee_be.entity.User;
import vn.fcc.pos_coffee_be.exception.ConflictException;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.CashHistoryRepository;
import vn.fcc.pos_coffee_be.repository.UserRepository;
import vn.fcc.pos_coffee_be.service.ICashHistoryService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CashHistoryServiceImpl implements ICashHistoryService {

    public static final String STATUS_OPEN = "OPEN";
    public static final String STATUS_CLOSED = "CLOSE";

    private final CashHistoryRepository cashHistoryRepository;
    private final UserRepository userRepository;

    @Override
    public CashHistoryResponse openCash(BigDecimal openAmount) {
        if (cashHistoryRepository.existsByStatus(STATUS_OPEN)) {
            throw new ConflictException("Đã có ca mở, hãy đóng ca trước khi mở ca mới.");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));

        CashHistory record = CashHistory.builder()
                .user(user)
                .openTime(LocalDateTime.now())
                .openAmount(openAmount)
                .status(STATUS_OPEN)
                .build();

        return toResponse(cashHistoryRepository.save(record));
    }

    @Override
    public CashHistoryResponse closeCash(BigDecimal closeAmount) {
        CashHistory record = cashHistoryRepository
                .findFirstByStatusOrderByOpenTimeDesc(STATUS_OPEN)
                .orElseThrow(() -> new ResourceNotFoundException("Chưa có ca mở để đóng."));

        record.setCloseTime(LocalDateTime.now());
        record.setCloseAmount(closeAmount);
        record.setStatus(STATUS_CLOSED);

        return toResponse(cashHistoryRepository.save(record));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CashHistoryResponse> getCurrentOpen() {
        return cashHistoryRepository
                .findFirstByStatusOrderByOpenTimeDesc(STATUS_OPEN)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CashHistoryResponse> listAll() {
        return cashHistoryRepository.findAll(Sort.by(Sort.Direction.DESC, "openTime"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private CashHistoryResponse toResponse(CashHistory ch) {
        return new CashHistoryResponse(
                ch.getId(),
                ch.getUser().getId(),
                ch.getUser().getUsername(),
                ch.getOpenTime(),
                ch.getCloseTime(),
                ch.getOpenAmount(),
                ch.getCloseAmount(),
                ch.getStatus()
        );
    }
}
