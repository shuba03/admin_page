package com.queen.mobiles.admin.lib.order;

import com.queen.mobiles.admin.lib.product.Product;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class OrderItem {
    private String orderItemId;

    private Product product;
    
    private int quantity;

    private float unitPrice;
    private float price;
}
