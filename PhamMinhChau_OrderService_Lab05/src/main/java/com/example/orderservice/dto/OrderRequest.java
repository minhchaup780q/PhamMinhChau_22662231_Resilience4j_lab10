package com.example.orderservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest
{
    private Long userId;
    private List<ItemRequest> items;
}
