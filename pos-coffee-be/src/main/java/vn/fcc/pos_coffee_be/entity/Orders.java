package vn.fcc.pos_coffee_be.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", nullable = false, unique = true)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    // Keep this column nullable for legacy orders. SQL Server cannot add a
    // required column to the existing, non-empty orders table during Hibernate
    // schema update. New POS orders still always receive the active shift slot
    // in PosOrderServiceImpl.
    @JoinColumn(name = "slot_id")
    private ShiftSlot slot;

    // Retain the concrete check-in shift for compatibility with the existing
    // orders.shift_id foreign key. It is nullable in the mapping so Hibernate
    // can also upgrade databases that do not have this legacy column yet.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id")
    private Shifts shift;

    @Builder.Default
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "total_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "discount_amount", precision = 18, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "final_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal finalAmount;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}
