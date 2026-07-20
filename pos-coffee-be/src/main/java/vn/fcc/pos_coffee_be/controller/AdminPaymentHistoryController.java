package vn.fcc.pos_coffee_be.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.fcc.pos_coffee_be.dto.response.PaymentHistoryResponse;
import vn.fcc.pos_coffee_be.service.IAdminPaymentHistoryService;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/admin/payment-history")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminPaymentHistoryController {

    private final IAdminPaymentHistoryService paymentHistoryService;

    @GetMapping
    public Page<PaymentHistoryResponse> getPaymentHistory(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(size = 15, sort = "orderDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return paymentHistoryService.getPaymentHistory(
                keyword, paymentMethod, fromDate, toDate, pageable
        );
    }
}
