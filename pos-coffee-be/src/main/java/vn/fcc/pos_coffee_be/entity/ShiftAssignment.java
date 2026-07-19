package vn.fcc.pos_coffee_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(
        name = "shift_assignments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_assignment_slot_employee_date",
                        columnNames = {"slot_id", "employee_user_id", "work_date"}
                )
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "slot_id", nullable = false)
    private ShiftSlot slot;

    @Column(name = "employee_user_id", nullable = false, length = 36)
    private String employeeUserId;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @Column(length = 255)
    private String note;
}
