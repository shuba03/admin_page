package com.queen.mobiles.admin.lib.product;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Product {
    String id;
    String name;
    String color;

    String brand;
    float price;

    String description;

    int stock;
}
