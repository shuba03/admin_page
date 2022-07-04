package com.queen.mobiles.admin.lib.order;

import com.queen.mobiles.admin.lib.product.Product;

import lombok.Data;

@Data
public class OrderDetailItem {

    private String orderDetailId;

    private String productId;

    private int quantity;

    private double unitPrice;

    private double price;

    private Product product;
}
