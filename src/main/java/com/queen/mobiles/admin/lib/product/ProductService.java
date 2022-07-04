package com.queen.mobiles.admin.lib.product;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.queen.mobiles.admin.lib.common.Image;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepo;

    public Image getProductImage(String productId) {
        return this.productRepo.getProductImage(productId);
    }

    public Product getProduct(String productId) {
        Product product = this.productRepo.getProduct(productId);
        return product;
    }

    public int getTotalProducts() {
        return this.productRepo.getTotalProducts();
    }

    public List<Product> getProducts(ProductSearchRequest searchContext) {
        OrderBy orderBy = this.getOrderByValue(searchContext.getSortType());
        List<Product> products = this.productRepo.getProducts(searchContext.getPageNo(), searchContext.getSearchTerm(),
                searchContext.getBrands(), searchContext.getColors(), orderBy);

        return products;
    }

    private OrderBy getOrderByValue(String sortType) {

        System.out.println(sortType);

        if (sortType == null || sortType.trim().equals("")) {
            return OrderBy.NONE;
        }

        if (sortType.trim().equals("price-low-to-high")) {
            return OrderBy.PRICE_ASC;
        }

        if (sortType.trim().equals("price-high-to-low")) {
            return OrderBy.PRICE_DESC;
        }

        if (sortType.trim().equals("rating")) {
            return OrderBy.RATING;
        }

        return null;
    }

}
