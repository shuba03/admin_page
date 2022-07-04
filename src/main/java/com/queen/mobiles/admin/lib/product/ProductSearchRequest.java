package com.queen.mobiles.admin.lib.product;

import java.util.List;

import lombok.Data;

@Data
public class ProductSearchRequest {

    private String searchTerm;

    private List<String> colors;

    private List<String> brands;

    private String sortType;

    private int pageNo;
}
