package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.CashHistoryCloseRequest;
import vn.fcc.pos_coffee_be.dto.request.CashHistoryOpenRequest;
import vn.fcc.pos_coffee_be.dto.response.CashHistoryResponse;
import vn.fcc.pos_coffee_be.service.ICashHistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cash-history")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public class CashHistoryController {

    private final ICashHistoryService cashHistoryService;

    @PostMapping("/open")
    @ResponseStatus(HttpStatus.CREATED)
    public CashHistoryResponse open(@RequestBody @Valid CashHistoryOpenRequest request) {
        return cashHistoryService.openCash(request.openAmount());
    }

    @PutMapping("/close")
    public CashHistoryResponse close(@RequestBody @Valid CashHistoryCloseRequest request) {
        return cashHistoryService.closeCash(request.closeAmount());
    }

    @GetMapping("/current")
    public CashHistoryResponse current() {
        return cashHistoryService.getCurrentOpen()
                .orElse(null);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CashHistoryResponse> listAll() {
        return cashHistoryService.listAll();
    }
}
