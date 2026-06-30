package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.fcc.pos_coffee_be.dto.request.VoucherRequest;
import vn.fcc.pos_coffee_be.dto.response.VoucherResponse;
import vn.fcc.pos_coffee_be.entity.Voucher;
import vn.fcc.pos_coffee_be.exception.ConflictException;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.VoucherRepository;
import vn.fcc.pos_coffee_be.service.IVoucherService;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements IVoucherService {

    private final VoucherRepository voucherRepository;

    @Override
    public VoucherResponse createVoucher(VoucherRequest request) {
        if (voucherRepository.findByCode(request.code().toUpperCase()).isPresent()) {
            throw new ConflictException("Mã voucher đã tồn tại");
        }

        Voucher voucher = new Voucher();
        voucher.setCode(request.code().toUpperCase());
        voucher.setDiscountType(request.discountType());
        voucher.setDiscountValue(request.discountValue());
        voucher.setMinOrderValue(request.minOrderValue());
        voucher.setMaxDiscount(request.maxDiscount());
        voucher.setExpiryDate(request.expiryDate());
        voucher.setStatus(true);

        return mapToResponse(voucherRepository.save(voucher));
    }

    @Override
    public VoucherResponse updateStatus(String id, Boolean status) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Voucher với ID: " + id));
        voucher.setStatus(status);
        return mapToResponse(voucherRepository.save(voucher));
    }

    @Override
    public Page<VoucherResponse> getAllVouchers(Pageable pageable) {
        return voucherRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public Optional<VoucherResponse> getVoucherByCode(String code) {
        return voucherRepository.findByCode(code.toUpperCase())
                .filter(v -> v.getStatus() && v.getExpiryDate().isAfter(LocalDateTime.now()))
                .map(this::mapToResponse);
    }

    private VoucherResponse mapToResponse(Voucher v) {
        return new VoucherResponse(
                v.getId(),
                v.getCode(),
                v.getDiscountType(),
                v.getDiscountValue(),
                v.getMinOrderValue(),
                v.getMaxDiscount(),
                v.getExpiryDate(),
                v.getStatus()
        );
    }
}