package vn.fcc.pos_coffee_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "hourly_wage", nullable = false, precision = 18, scale = 2)
    private BigDecimal hourlyWage;

    @Column(name = "hire_date", nullable = false)
    private LocalDateTime hireDate;
}
