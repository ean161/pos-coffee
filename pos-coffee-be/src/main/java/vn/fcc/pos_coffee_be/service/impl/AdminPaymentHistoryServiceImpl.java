package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.response.PaymentHistoryResponse;
import vn.fcc.pos_coffee_be.entity.Orders;
import vn.fcc.pos_coffee_be.repository.OrdersRepository;
import vn.fcc.pos_coffee_be.service.IAdminPaymentHistoryService;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminPaymentHistoryServiceImpl implements IAdminPaymentHistoryService {

    private final OrdersRepository ordersRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentHistoryResponse> getPaymentHistory(
            String keyword,
            String paymentMethod,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable
    ) {
        String normalizedKeyword = normalize(keyword);
        String normalizedMethod = normalize(paymentMethod);
        LocalDateTime from = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime toExclusive = toDate != null ? toDate.plusDays(1).atStartOfDay() : null;

        return ordersRepository.searchPaymentHistory(
                        normalizedKeyword,
                        normalizedMethod,
                        from,
                        toExclusive,
                        pageable
                )
                .map(this::toResponse);
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private PaymentHistoryResponse toResponse(Orders order) {
        return new PaymentHistoryResponse(
                order.getId(),
                order.getInvoiceNumber(),
                order.getUser().getFullName(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getDiscountAmount(),
                order.getFinalAmount(),
                order.getPaymentMethod()
        );
    }
}
