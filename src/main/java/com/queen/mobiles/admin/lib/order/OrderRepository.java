package com.queen.mobiles.admin.lib.order;

import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class OrderRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<OrderItem> getOrders(String orderStatus) {
        StringBuilder query = new StringBuilder(
                "SELECT o.id, o.date_time, o.delivery_address, o.total_price, o.status, COUNT(od.id) as product_cnt "
                        + "FROM `order` o INNER JOIN order_detail od ON od.orderid = o.id ");

        if (orderStatus != null && !orderStatus.trim().equals("")) {
            query.append("AND o.status = '" + orderStatus + "' ");
        }

        query.append("GROUP BY o.id, o.date_time, o.delivery_address, o.total_price, o.status ")
                .append("ORDER BY o.date_time DESC");

        System.out.println("*****************************************************************");
        System.out.println(query.toString());
        System.out.println("*****************************************************************");

        return jdbcTemplate.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query.toString());
            return statement;
        }, resultSet -> {
            List<OrderItem> items = new LinkedList<>();
            while (resultSet.next()) {
                OrderItem item = new OrderItem();
                item.setAddress(resultSet.getString("delivery_address"));
                item.setDateTime(
                        resultSet.getTimestamp("date_time").toLocalDateTime().toString());
                item.setId(resultSet.getString("id"));
                item.setProductCount(resultSet.getInt("product_cnt"));
                item.setStatus(resultSet.getString("status"));
                item.setTotalPrice(resultSet.getFloat("total_price"));

                items.add(item);
            }
            return items;
        });
    }

    public OrderItem getOrder(String orderId) {
        String query = "SELECT o.id, o.date_time, o.delivery_address, o.total_price, o.status, "
                + "od.productid, od.quantity, od.product_price, od.total_price as price, od.id as order_detail_id "
                + "FROM `order` o INNER JOIN order_detail od ON od.orderid = o.id "
                + "WHERE o.id = ?";

        return jdbcTemplate.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, orderId);
            return statement;
        }, resultSet -> {
            OrderItem item = null;
            while (resultSet.next()) {
                if (item == null) {
                    item = new OrderItem();
                    item.setAddress(resultSet.getString("delivery_address"));
                    item.setDateTime(
                            resultSet.getTimestamp("date_time").toLocalDateTime().toString());
                    item.setId(resultSet.getString("id"));
                    item.setStatus(resultSet.getString("status"));
                    item.setTotalPrice(resultSet.getFloat("total_price"));
                    item.setDetails(new ArrayList<>());
                }

                OrderDetailItem detailItem = new OrderDetailItem();
                detailItem.setOrderDetailId(resultSet.getString("order_detail_id"));
                detailItem.setPrice(resultSet.getFloat("price"));
                detailItem.setProductId(resultSet.getString("productid"));
                detailItem.setQuantity(resultSet.getInt("quantity"));
                detailItem.setUnitPrice(resultSet.getFloat("product_price"));

                item.getDetails().add(detailItem);
            }

            return item;
        });
    }

    public void updateOrderStatus(String orderId, OrderStatus status) {
        String query = "UPDATE order SET status = ? WHERE id = ?";

        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, status.name());
            statement.setString(2, orderId);
            return statement;
        });
    }
}
