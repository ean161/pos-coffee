package vn.fcc.pos_coffee_be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    @Min(value = 0)
    private BigDecimal basePrice;

    @Column(nullable = false)
    private Boolean status = true;
}