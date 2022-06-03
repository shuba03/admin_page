package com.queen.mobiles.admin.lib.product;

import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ProductRepository {

    @Autowired
    private JdbcTemplate jdbc;

    private static int PAGINATION_LIMIT = 20;

    public List<Product> listProducts(int pageNo) {
        String query = "SELECT id, product_name, color, brand, price, description, count_in_stock "
            + "FROM products ORDER BY product_name LIMIT ?,?";

        int skip = (pageNo - 1) * PAGINATION_LIMIT;

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setInt(1, skip);
            statement.setInt(2, PAGINATION_LIMIT);
            return statement;
        }, resultSet -> {
            List<Product> products = new LinkedList<>();
            while (resultSet.next()) {
                Product product = Product.builder().id(resultSet.getString("id"))
                        .name(resultSet.getString("product_name"))
                        .color(resultSet.getString("color"))
                        .brand(resultSet.getString("brand"))
                        .price(resultSet.getFloat("price"))
                        .description(resultSet.getString("description"))
                        .stock(resultSet.getInt("count_in_stock"))
                        .build();
                products.add(product);
            }

            return products;
        });
    }

    public Product getProduct(String productId) {
        String query = "SELECT id, product_name, color, brand, price, description, count_in_stock "
        + "FROM products WHERE id = ?";

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, productId);
            return statement;
        }, resultSet -> {
            Product product = null;
            if (resultSet.next()) {
                product = Product.builder().id(resultSet.getString("id"))
                        .name(resultSet.getString("product_name"))
                        .color(resultSet.getString("color"))
                        .brand(resultSet.getString("brand"))
                        .price(resultSet.getFloat("price"))
                        .description(resultSet.getString("description"))
                        .stock(resultSet.getInt("count_in_stock"))
                        .build();
            }

            return product;
        });
    }

    public Map<String, Float> getRatings(List<String> productIds) {
        String query = "SELECT product_id, avg(rating) as rating FROM rating "
            + "WHERE product_id in ('" + String.join("','", productIds) + "') "
            + "GROUP BY product_id";

            return jdbc.query(query, resultSet -> {
                Map<String, Float> ratings = new HashMap<>();
                while (resultSet.next()) {
                    String productId = resultSet.getString("product_id");
                    float rating = resultSet.getFloat("rating");
                    ratings.put(productId, rating);
                }
                return ratings;
            });
    }

    public List<ReviewComment> getReviews(String productId) {
        String query = "SELECT r.review_id, r.user_id, u.user_name, r.product_id, r.review, r.date_time FROM review r "
            + "INNER JOIN user u ON u.user_id = r.user_id "
            + "WHERE product_id = ? ";

            return jdbc.query(connection -> {
                PreparedStatement statement = connection.prepareStatement(query);
                statement.setString(1, productId);
                return statement;
            }, resultSet -> {
                List<ReviewComment> reviews = new LinkedList<>();
                while (resultSet.next()) {
                    ReviewComment comment = ReviewComment.builder()
                        .addedAt(resultSet.getTimestamp("date_time").toLocalDateTime())
                        .id(resultSet.getString("review_id"))
                        .userId(resultSet.getString("user_id"))
                        .userName(resultSet.getString("user_name"))
                        .review(resultSet.getString("review"))
                        .build();

                    reviews.add(comment);
                }
                return reviews;
            });
    }

}
