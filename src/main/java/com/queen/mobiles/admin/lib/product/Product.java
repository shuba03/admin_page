package com.queen.mobiles.admin.lib.product;

import lombok.Data;

@Data
public class Product {

    private String id;
    private String name;
    private String description;
    private String brand;
    private String color;

    private double price;

    private boolean addedInCart;
    private boolean addedInFav;

    private double overallRating;
    private int totalReviews;
}
