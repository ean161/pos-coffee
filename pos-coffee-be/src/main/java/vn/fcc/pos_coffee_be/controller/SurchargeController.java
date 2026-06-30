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
import vn.fcc.pos_coffee_be.dto.request.SurchargeRequest;
import vn.fcc.pos_coffee_be.dto.response.SurchargeResponse;
import vn.fcc.pos_coffee_be.service.ISurchargeService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/surcharges")
@RequiredArgsConstructor
public class SurchargeController {
    private final ISurchargeService surchargeService;

    @PostMapping
    public ResponseEntity<SurchargeResponse> create(@Valid @RequestBody SurchargeRequest request) {
        return new ResponseEntity<>(surchargeService.createSurcharge(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<SurchargeResponse>> getAll(
            @PageableDefault(size = 10, sort = "startTime", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(surchargeService.getAllSurcharges(pageable));
    }

    @GetMapping("/active")
    public ResponseEntity<List<SurchargeResponse>> getActive() {
        return ResponseEntity.ok(surchargeService.getActiveSurcharges());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable String id, @RequestParam Boolean status) {
        surchargeService.updateStatus(id, status);
        return ResponseEntity.noContent().build();
    }
}