package vn.fcc.pos_coffee_be.service;

import vn.fcc.pos_coffee_be.dto.request.CreateOrderRequest;
import vn.fcc.pos_coffee_be.dto.request.VoucherValidateRequest;
import vn.fcc.pos_coffee_be.dto.response.OrderResponse;
import vn.fcc.pos_coffee_be.dto.response.PosMenuResponse;
import vn.fcc.pos_coffee_be.dto.response.VoucherValidationResponse;

public interface IPosOrderService {

    OrderResponse createOrder(CreateOrderRequest request);

    PosMenuResponse getMenu();

    VoucherValidationResponse validateVoucher(VoucherValidateRequest request);
}
