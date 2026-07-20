package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.request.ShiftCheckInRequest;
import vn.fcc.pos_coffee_be.dto.request.ShiftCheckOutRequest;
import vn.fcc.pos_coffee_be.dto.response.ShiftStatusResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftsResponseDTO;

import java.util.Optional;

public interface IShiftsService {
    ShiftsResponseDTO checkIn(ShiftCheckInRequest request);
    ShiftsResponseDTO checkOut(ShiftCheckOutRequest request);
    ShiftStatusResponse checkCurrentShift(String username);
    Optional<ShiftsResponseDTO> getCurrent();
}