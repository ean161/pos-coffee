package vn.fcc.pos_coffee_be.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.fcc.pos_coffee_be.dto.request.VoucherRequest;
import vn.fcc.pos_coffee_be.dto.response.VoucherResponse;
import vn.fcc.pos_coffee_be.entity.Voucher;

import java.util.Optional;

public interface IVoucherService {
    VoucherResponse createVoucher(VoucherRequest request);
    VoucherResponse updateStatus(String id, Boolean status);
    Page<VoucherResponse> getAllVouchers(Pageable pageable);
    Optional<VoucherResponse> getVoucherByCode(String code);
}