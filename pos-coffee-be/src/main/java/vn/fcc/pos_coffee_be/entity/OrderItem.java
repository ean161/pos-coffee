package vn.fcc.pos_coffee_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @Column(name = "variant_name", length = 20)
    private String variantName;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "size_name", length = 10)
    private String sizeName;

    @Column(name = "sugar_level", length = 10)
    private String sugarLevel;

    @Column(name = "ice_level", length = 10)
    private String iceLevel;

    @Column(name = "line_total", nullable = false)
    private BigDecimal lineTotal;

    @Column(name = "topping_total", nullable = false)
    private BigDecimal toppingTotal = BigDecimal.ZERO;

    @ManyToMany
    @JoinTable(
        name = "order_item_toppings",
        joinColumns = @JoinColumn(name = "order_item_id"),
        inverseJoinColumns = @JoinColumn(name = "topping_id")
    )
    private List<Topping> toppings = new ArrayList<>();
}
