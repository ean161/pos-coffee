package vn.fcc.pos_coffee_be.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SurchargeRequest(
        @NotBlank(message = "Tên không được để trống")
        String name,

        @NotBlank(message = "Loại phụ thu không được để trống")
        String surchargeType,

        @NotNull(message = "Giá trị không được để trống")
        BigDecimal value,

        @NotNull(message = "Thời gian bắt đầu không được để trống")
        LocalDateTime startTime,

        @NotNull(message = "Thời gian kết thúc không được để trống")
        LocalDateTime endTime
) {}