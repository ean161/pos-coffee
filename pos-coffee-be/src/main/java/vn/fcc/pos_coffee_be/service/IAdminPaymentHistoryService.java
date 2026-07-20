package vn.fcc.pos_coffee_be.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.fcc.pos_coffee_be.dto.response.PaymentHistoryResponse;

import java.time.LocalDate;

public interface IAdminPaymentHistoryService {
    Page<PaymentHistoryResponse> getPaymentHistory(
            String keyword,
            String paymentMethod,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable
    );
}
