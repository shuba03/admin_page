package com.queen.mobiles.admin.lib.order;

import java.time.LocalDateTime;
import java.util.List;

import com.queen.mobiles.admin.lib.user.User;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Order {
    private User user;

    private String orderId;
    private LocalDateTime orderedAt;

    private String deliveryAddress;
    
    private float totalPrice;
    private String status;
    private List<OrderItem> items;
}
