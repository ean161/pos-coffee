package vn.fcc.pos_coffee_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
    name = "shift_slots",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_shift_slot_name_workdate", columnNames = {"name", "work_date"})
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ShiftSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private boolean active = true;

    /** Ngày cụ thể của slot. Slot chỉ hiển thị trên cột của workDate này. */
    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;
}