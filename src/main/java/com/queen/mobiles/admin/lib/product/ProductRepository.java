package com.queen.mobiles.admin.lib.product;

import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.queen.mobiles.admin.lib.common.Image;

@Repository
public class ProductRepository {

    @Autowired
    private JdbcTemplate jdbc;

    @Value("${product.page-size}")
    private int DEFAULT_FETCH_LIMIT;

    public Image getProductImage(String productId) {
        String query = "SELECT image, mime FROM products WHERE id = ?";

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, productId);
            return statement;
        }, resultSet -> {
            Image image = null;
            if (resultSet.next()) {
                image = new Image();
                image.setData(resultSet.getBytes("image"));
                image.setMime(resultSet.getString("mime"));
            }

            return image;
        });
    }

    public int getTotalProducts() {
        String query = "SELECT count(1) total_products FROM products WHERE count_in_stock > 0";

        return jdbc.query(query, resultSet -> {
            if (resultSet.next()) {
                return resultSet.getInt("total_products");
            }
            return 0;
        });
    }

    public List<Product> getProducts(List<String> productIds) {
        String query = "SELECT id, product_name, color, brand, price, description "
                + "FROM products WHERE id IN ('" + String.join("','", productIds) + "')";

        return jdbc.query(query, resultSet -> {
            List<Product> products = new LinkedList<>();
            while (resultSet.next()) {
                Product product = new Product();
                product.setBrand(resultSet.getString("brand"));
                product.setColor(resultSet.getString("color"));
                product.setDescription(resultSet.getString("description"));
                product.setId(resultSet.getString("id"));
                product.setName(resultSet.getString("product_name"));
                product.setPrice(resultSet.getFloat("price"));
                products.add(product);
            }
            return products;
        });
    }

    public List<Product> getProducts(
            int pageNo, String searchQuery, List<String> brands, List<String> colors, OrderBy orderBy) {

        String query = "SELECT p.id, p.product_name, p.color, p.brand, p.price, p.description, avg(r.rating) rating, count(1) total_reviews "
                + "FROM products p LEFT JOIN rating r ON r.product_id = p.id "
                + "WHERE p.count_in_stock > 0";

        if (brands != null && brands.size() > 0) {
            query += " AND p.brand in ('" + String.join("','", brands) + "')";
        }

        if (colors != null && colors.size() > 0) {
            query += " AND p.color in ('" + String.join("','", colors) + "')";
        }

        if (searchQuery != null && !searchQuery.trim().equals("")) {
            query += " AND p.product_name LIKE '%" + searchQuery + "%'";
        }

        // add group by to get avg rating
        query += " GROUP BY p.id, p.product_name, p.color, p.brand, p.price, p.description";

        if (orderBy == null || orderBy == OrderBy.NONE) {
            query += " ORDER BY p.id";
        } else if (orderBy == OrderBy.PRICE_ASC) {
            query += " ORDER BY p.price";
        } else if (orderBy == OrderBy.PRICE_DESC) {
            query += " ORDER BY p.price DESC";
        } else if (orderBy == OrderBy.RATING) {
            query += " ORDER BY rating DESC";
        }

        int skip = (pageNo - 1) * DEFAULT_FETCH_LIMIT;

        query += " LIMIT " + skip + ", " + DEFAULT_FETCH_LIMIT;

        System.out.println("*****************************************************************************");
        System.out.println(query);
        System.out.println("*****************************************************************************");

        return jdbc.query(query, resultSet -> {
            List<Product> products = new LinkedList<>();
            while (resultSet.next()) {
                Product product = new Product();
                product.setBrand(resultSet.getString("brand"));
                product.setColor(resultSet.getString("color"));
                product.setDescription(resultSet.getString("description"));
                product.setId(resultSet.getString("id"));
                product.setName(resultSet.getString("product_name"));
                product.setOverallRating(resultSet.getFloat("rating"));
                product.setPrice(resultSet.getFloat("price"));
                product.setTotalReviews(resultSet.getInt("total_reviews"));
                products.add(product);
            }
            return products;
        });
    }

    public Product getProduct(String productId) {
        String query = "SELECT p.id, p.product_name, p.color, p.brand, p.price, p.description, avg(r.rating) rating, count(1) total_reviews "
                + "FROM products p LEFT JOIN rating r ON r.product_id = p.id "
                + "WHERE p.id = ? AND p.count_in_stock > 0 GROUP BY p.id, p.product_name, p.color, p.brand, p.price, p.description ";

        System.out.println("*****************************************************************************");
        System.out.println(query);
        System.out.println("*****************************************************************************");

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, productId);
            return statement;
        }, resultSet -> {
            Product product = null;
            while (resultSet.next()) {
                product = new Product();
                product.setBrand(resultSet.getString("brand"));
                product.setColor(resultSet.getString("color"));
                product.setDescription(resultSet.getString("description"));
                product.setId(resultSet.getString("id"));
                product.setName(resultSet.getString("product_name"));
                product.setOverallRating(resultSet.getFloat("rating"));
                product.setPrice(resultSet.getFloat("price"));
                product.setTotalReviews(resultSet.getInt("total_reviews"));
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
