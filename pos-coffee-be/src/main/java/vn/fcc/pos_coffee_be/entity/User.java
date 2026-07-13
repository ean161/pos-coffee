package vn.fcc.pos_coffee_be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor @AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotNull
    @Column(unique = true, length = 50)
    private String username;

    @NotNull
    private String password;

    @Column(name = "full_name", length = 100)
    private String fullName;

    // enums: "ADMIN" | "STAFF"
    @Column(length = 20)
    private String role;

    // 0: Disabled, 1: active
    private Boolean status;
}
