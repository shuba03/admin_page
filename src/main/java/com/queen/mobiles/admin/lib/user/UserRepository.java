package com.queen.mobiles.admin.lib.user;

import java.sql.PreparedStatement;
import java.util.LinkedList;
import java.util.List;

import com.queen.mobiles.admin.lib.common.Image;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbc;

    private static int PAGINATION_LIMIT = 20;

    public List<User> listUsers(int pageNo) {
        String query = "SELECT user_id, user_name, email, contact_no, address, city, pincode "
                + "FROM user ORDER BY user_name LIMIT ?, ?";

        int skip = (pageNo - 1) * PAGINATION_LIMIT;

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setInt(1, skip);
            statement.setInt(2, PAGINATION_LIMIT);
            return statement;
        }, resultSet -> {
            List<User> users = new LinkedList<>();
            while (resultSet.next()) {
                User user = User.builder().address(resultSet.getString("address"))
                        .email(resultSet.getString("email"))
                        .id(resultSet.getString("user_id"))
                        .name(resultSet.getString("user_name"))
                        .phone(resultSet.getString("contact_no"))
                        .pincode(resultSet.getString("pincode"))
                        .city(resultSet.getString("city"))
                        .build();

                users.add(user);
            }

            return users;
        });
    }

    public User getUser(String userId) {
        String query = "SELECT user_id, user_name, email, contact_no, address, city, pincode "
                + "FROM user WHERE user_id = ?";

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, userId);
            return statement;
        }, resultSet -> {
            User user = null;
            if (resultSet.next()) {
                user = User.builder().address(resultSet.getString("address"))
                        .email(resultSet.getString("email"))
                        .id(resultSet.getString("user_id"))
                        .name(resultSet.getString("user_name"))
                        .phone(resultSet.getString("contact_no"))
                        .pincode(resultSet.getString("pincode"))
                        .city(resultSet.getString("city"))
                        .build();
            }

            return user;
        });
    }


    public Image getUserImage(String userId) {
        String query = "SELECT image, mime FROM user WHERE user_id = ?";

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, userId);
            return statement;
        }, resultSet -> {
            Image image = null;
            if (resultSet.next()) {
               image = new Image();
               byte[] data = resultSet.getBytes("image");
               String mime = resultSet.getString("mime");
               image.setData(data);
               image.setMime(mime);
            }

            return image;
        });
    }

    public User getUserByEmail(String email) {
        String query = "SELECT user_id, user_name, email, contact_no, address, city, pincode, password "
        + "FROM user WHERE email = ?";

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, email);
            return statement;
        }, resultSet -> {
            User user = null;
            if (resultSet.next()) {
                user = User.builder().address(resultSet.getString("address"))
                        .email(resultSet.getString("email"))
                        .id(resultSet.getString("user_id"))
                        .name(resultSet.getString("user_name"))
                        .phone(resultSet.getString("contact_no"))
                        .pincode(resultSet.getString("pincode"))
                        .city(resultSet.getString("city"))
                        .password(resultSet.getString("password"))
                        .build();
            }

            return user;
        });
    }
}
