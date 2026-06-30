package vn.fcc.pos_coffee_be.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.fcc.pos_coffee_be.dto.request.SurchargeRequest;
import vn.fcc.pos_coffee_be.dto.response.SurchargeResponse;

import java.util.List;

public interface ISurchargeService {
    SurchargeResponse createSurcharge(SurchargeRequest request);
    Page<SurchargeResponse> getAllSurcharges(Pageable pageable);
    List<SurchargeResponse> getActiveSurcharges();
    void updateStatus(String id, Boolean status);
}
