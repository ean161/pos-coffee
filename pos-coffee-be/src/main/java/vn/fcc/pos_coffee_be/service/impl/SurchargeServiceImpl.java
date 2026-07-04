package vn.fcc.pos_coffee_be.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fcc.pos_coffee_be.dto.request.SurchargeRequest;
import vn.fcc.pos_coffee_be.dto.response.SurchargeResponse;
import vn.fcc.pos_coffee_be.entity.Surcharge;
import vn.fcc.pos_coffee_be.exception.ResourceNotFoundException;
import vn.fcc.pos_coffee_be.repository.SurchargeRepository;
import vn.fcc.pos_coffee_be.service.ISurchargeService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SurchargeServiceImpl implements ISurchargeService {
    private final SurchargeRepository surchargeRepository;

    @Override
    public SurchargeResponse createSurcharge(SurchargeRequest request) {
        if (request.endTime().isBefore(request.startTime())) {
            throw new RuntimeException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }
        Surcharge s = new Surcharge();
        s.setName(request.name());
        s.setSurchargeType(request.surchargeType());
        s.setValue(request.value());
        s.setStartTime(request.startTime());
        s.setEndTime(request.endTime());
        s.setStatus(true);
        return mapToResponse(surchargeRepository.save(s));
    }

    @Override
    public Page<SurchargeResponse> getAllSurcharges(Pageable pageable) {
        return surchargeRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public List<SurchargeResponse> getActiveSurcharges() {
        LocalDateTime now = LocalDateTime.now();
        return surchargeRepository.findByStatusTrueAndStartTimeBeforeAndEndTimeAfter(now, now)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public void updateStatus(String id, Boolean status) {
        Surcharge s = surchargeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phụ thu: " + id));
        s.setStatus(status);
        surchargeRepository.save(s);
    }

    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void autoUpdateExpiredSurcharges() {
        surchargeRepository.updateExpiredSurcharges(LocalDateTime.now());
    }

    private SurchargeResponse mapToResponse(Surcharge s) {
        return new SurchargeResponse(s.getId(), s.getName(), s.getSurchargeType(),
                s.getValue(), s.getStartTime(), s.getEndTime(), s.getStatus());
    }
}