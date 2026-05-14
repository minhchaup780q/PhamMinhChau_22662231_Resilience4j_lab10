package com.example.orderservice.dto;

import lombok.Data;

@Data
public class ItemRequest {
    private Long foodId;
    private Integer quantity;
    private Double price;
}
