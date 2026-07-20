package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.response.CashHistoryResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ICashHistoryService {

    CashHistoryResponse openCash(BigDecimal openAmount);

    CashHistoryResponse closeCash(BigDecimal closeAmount);

    Optional<CashHistoryResponse> getCurrentOpen();

    List<CashHistoryResponse> listAll();
}
