package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateOrderRequest(

        @Size(max = 100, message = "Tên khách hàng không quá 100 ký tự")
        String customerName,

        @Size(max = 20, message = "Số điện thoại không quá 20 ký tự")
        String customerPhone,

        @NotNull(message = "Loại đơn hàng không được để trống")
        @Size(max = 20, message = "Loại đơn hàng không quá 20 ký tự")
        String orderType,

        @Size(max = 20, message = "Số bàn không quá 20 ký tự")
        String tableNumber,

        @NotNull(message = "Phương thức thanh toán không được để trống")
        @Size(max = 20, message = "Phương thức thanh toán không quá 20 ký tự")
        String paymentMethod,

        @Size(max = 500, message = "Ghi chú không quá 500 ký tự")
        String notes,

        @Size(max = 50, message = "Mã voucher không quá 50 ký tự")
        String voucherCode,

        @NotEmpty(message = "Đơn hàng phải có ít nhất 1 món")
        @Valid
        List<OrderItemRequest> items
) {}
