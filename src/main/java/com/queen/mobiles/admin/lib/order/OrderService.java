package com.queen.mobiles.admin.lib.order;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.queen.mobiles.admin.lib.product.Product;
import com.queen.mobiles.admin.lib.product.ProductRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository repository;

    @Autowired
    private ProductRepository productRepository;

    public OrderItem getOrderDetails(String orderId) {
        OrderItem item = this.repository.getOrder(orderId);

        List<String> productIds = item.getDetails().stream().map(detailItem -> detailItem.getProductId())
                .collect(Collectors.toList());

        Map<String, Product> products = this.productRepository.getProducts(productIds)
                .stream().collect(Collectors.toMap(product -> product.getId(), product -> product));

        item.getDetails().forEach(detailItem -> {
            detailItem.setProduct(products.get(detailItem.getProductId()));
        });

        return item;
    }

    public List<OrderItem> getOrders(String orderStatus) {
        return this.repository.getOrders(orderStatus);
    }

    public void updateOrderStatus(String orderId, String orderStatus) {
        OrderStatus status = OrderStatus.valueOf(orderStatus);
        this.repository.updateOrderStatus(orderId, status);
    }

}
