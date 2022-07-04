package com.queen.mobiles.admin.lib.order;

import java.util.List;

import lombok.Data;

@Data
public class OrderItem {

    private String id;
    private String dateTime;

    private String address;

    private double totalPrice;

    private String status;
    private String userId;

    private int productCount;

    private List<OrderDetailItem> details;
}
