package vn.fcc.pos_coffee_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 20)
    private String discountType; // "PERCENT" hoặc "AMOUNT"

    @Column(nullable = false)
    private BigDecimal discountValue;

    @Column(nullable = false)
    private BigDecimal minOrderValue;

    private BigDecimal maxDiscount;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private Boolean status = true;
}
