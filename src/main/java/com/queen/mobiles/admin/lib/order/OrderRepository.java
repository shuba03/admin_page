package com.queen.mobiles.admin.lib.order;

import java.sql.PreparedStatement;
import java.util.LinkedList;
import java.util.List;

import com.queen.mobiles.admin.lib.product.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class OrderRepository {
    
    private static int PAGINATION_LIMIT = 20;

    @Autowired
    private JdbcTemplate jdbcTemplate;


    public List<Order> listOrders(int pageNo) {
        String query = "SELECT id, date_time, delivery_address, total_price, status, user_id "
        + "FROM order ORDER BY date_time DESC LIMIT ?,?";

        int skip = (pageNo - 1) * PAGINATION_LIMIT;
        
        return jdbcTemplate.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setInt(1, skip);
            statement.setInt(2, PAGINATION_LIMIT);
            return statement;
        }, resultSet -> {
            List<Order> orders = new LinkedList<>();
            while (resultSet.next()) {
                Order order = Order.builder().orderId(resultSet.getString("id"))
                        .orderedAt(resultSet.getTimestamp("date_time").toLocalDateTime())
                        .deliveryAddress(resultSet.getString("delivery_address"))
                        .status(resultSet.getString("status"))
                        .totalPrice(resultSet.getFloat("total_price"))
                        .build();
                orders.add(order);
            }

            return orders;
        });
    }


    public Order getOrder(String orderId) {
        String query = "SELECT o.id, o.date_time, o.delivery_address, o.total_price, o.status, o.user_id "
        + "oi.id as order_item_id, oi.productid, oi.quantity, oi.product_price as unit_price, oi.total_price as price "
        + "p.product_name, p.color, p.brand, p.price as current_price, p.description, p.mime "
        + "FROM order o "
        + "INNER JOIN order_detail oi ON oi.orderid = o.id "
        + "INNER JOIN products p ON oi.productid = p.id "
        + "WHERE o.id = ?";
        
        return jdbcTemplate.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, orderId);
            return statement;
        }, resultSet -> {
            Order order = null;
            while (resultSet.next()) {
                if(order == null) {
                    order = Order.builder().orderId(resultSet.getString("id"))
                        .orderedAt(resultSet.getTimestamp("date_time").toLocalDateTime())
                        .deliveryAddress(resultSet.getString("delivery_address"))
                        .status(resultSet.getString("status"))
                        .totalPrice(resultSet.getFloat("total_price"))
                        .items(new LinkedList<>())
                        .build();
                }

                Product product = Product.builder().brand(resultSet.getString("brand"))
                .color(resultSet.getString("color"))
                .description(resultSet.getString("description"))
                .id(resultSet.getString("productid"))
                .name(resultSet.getString("product_name"))
                .price(resultSet.getFloat("current_price"))
                .build();

                OrderItem item = OrderItem.builder()
                    .orderItemId(resultSet.getString("order_item_id"))
                    .price(resultSet.getFloat("price"))
                    .product(product)
                    .quantity(resultSet.getInt("quantity"))
                    .unitPrice(resultSet.getFloat("unit_price"))
                    .build();

                order.getItems().add(item);
            }

            return order;
        });
    }
    
}
