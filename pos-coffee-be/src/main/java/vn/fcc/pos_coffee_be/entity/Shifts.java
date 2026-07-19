package vn.fcc.pos_coffee_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "shifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Shifts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private ShiftSlot slot;

    @Column(name = "open_time", nullable = false)
    private LocalDateTime openTime;

    @Column(name = "close_time")
    private LocalDateTime closeTime;

    @Column(name = "initial_cash", nullable = false, precision = 18, scale = 2)
    private BigDecimal initialCash;

    @Column(name = "total_cash_system", precision = 18, scale = 2)
    private BigDecimal totalCashSystem;

    @Column(name = "total_qr_system", precision = 18, scale = 2)
    private BigDecimal totalQrSystem;

    @Column(name = "actual_cash", precision = 18, scale = 2)
    private BigDecimal actualCash;

    @Column(nullable = false, length = 20)
    private String status;

    @OneToMany(mappedBy = "shift")
    @JsonIgnore
    private List<Orders> orders;
}
