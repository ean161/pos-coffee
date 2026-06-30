package vn.fcc.pos_coffee_be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "surcharges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Surcharge {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "surcharge_type", nullable = false, length = 20)
    private String surchargeType; // PERCENT hoặc AMOUNT

    @Column(name = "surcharge_value", nullable = false, precision = 18, scale = 2)
    private BigDecimal value;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Boolean status = true;
}