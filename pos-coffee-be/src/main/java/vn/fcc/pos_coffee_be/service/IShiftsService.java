package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.request.CloseShiftRequestDTO;
import vn.fcc.pos_coffee_be.dto.response.ShiftStatusResponse;
import vn.fcc.pos_coffee_be.dto.response.ShiftsResponseDTO;
import vn.fcc.pos_coffee_be.entity.Shifts;


public interface IShiftsService {
 Shifts save(Shifts shifts);
 ShiftsResponseDTO closeShift(CloseShiftRequestDTO request);
 ShiftStatusResponse checkCurrentShift(String username);
}
