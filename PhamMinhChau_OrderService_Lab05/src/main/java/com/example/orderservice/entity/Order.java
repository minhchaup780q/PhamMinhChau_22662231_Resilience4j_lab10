package com.example.orderservice.entity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId; // ID từ User Service

    @Column(name = "total_price")
    private Double totalPrice;

    private String status; // PENDING, PAID, CANCELLED [cite: 22]

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Quan hệ 1 đơn hàng - nhiều chi tiết
    @JsonManagedReference
    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL)
    private List<OrderItem> items;
}