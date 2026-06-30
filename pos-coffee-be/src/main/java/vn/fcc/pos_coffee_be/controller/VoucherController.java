package vn.fcc.pos_coffee_be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fcc.pos_coffee_be.dto.request.VoucherRequest;
import vn.fcc.pos_coffee_be.dto.response.VoucherResponse;
import vn.fcc.pos_coffee_be.entity.Voucher;
import vn.fcc.pos_coffee_be.service.IVoucherService;

@RestController
@RequestMapping("/api/v1/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final IVoucherService voucherService;

    @GetMapping
    public ResponseEntity<Page<VoucherResponse>> getAllVouchers(
            @PageableDefault(size = 10, sort = "expiryDate", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(voucherService.getAllVouchers(pageable));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<VoucherResponse> getVoucherByCode(@PathVariable String code) {
        return voucherService.getVoucherByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<VoucherResponse> createVoucher(@Valid @RequestBody VoucherRequest request) {
        return new ResponseEntity<>(voucherService.createVoucher(request), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable String id,
            @RequestParam Boolean status) {
        voucherService.updateStatus(id, status);
        return ResponseEntity.noContent().build();
    }
}