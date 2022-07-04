package com.queen.mobiles.admin.lib.user;

import java.sql.PreparedStatement;

import com.queen.mobiles.admin.lib.common.Image;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbc;

    public User getUser(String userId) {
        String query = "SELECT user_id, first_name, last_name, email, phone, address, city, pincode "
                + "FROM admin WHERE user_id = ?";

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, userId);
            return statement;
        }, resultSet -> {
            User user = null;
            if (resultSet.next()) {
                user = new User();
                user.setAddress(resultSet.getString("address"));
                user.setEmail(resultSet.getString("email"));
                user.setId(resultSet.getString("user_id"));
                user.setFirstName(resultSet.getString("first_name"));
                user.setLastName(resultSet.getString("last_name"));
                user.setPhone(resultSet.getString("phone"));
                user.setPincode(resultSet.getString("pincode"));
                user.setCity(resultSet.getString("city"));
            }

            return user;
        });
    }

    public Image getUserImage(String userId) {
        String query = "SELECT image, image_mime FROM user WHERE user_id = ?";

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, userId);
            return statement;
        }, resultSet -> {
            Image image = null;
            if (resultSet.next()) {
                byte[] data = resultSet.getBytes("image");
                String mime = resultSet.getString("image_mime");

                if (data != null && data.length > 0) {
                    image = new Image();
                    image.setData(data);
                    image.setMime(mime);
                }
            }

            return image;
        });
    }

    public User getUserByEmail(String email) {
        String query = "SELECT user_id, first_name, last_name, email, phone, address, city, pincode, password, is_enabled "
                + "FROM admin WHERE email = ? AND is_enabled = 1";

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, email);
            return statement;
        }, resultSet -> {
            User user = null;
            if (resultSet.next()) {
                user = new User();
                user.setAddress(resultSet.getString("address"));
                user.setEmail(resultSet.getString("email"));
                user.setId(resultSet.getString("user_id"));
                user.setFirstName(resultSet.getString("first_name"));
                user.setLastName(resultSet.getString("last_name"));
                user.setPhone(resultSet.getString("phone"));
                user.setPincode(resultSet.getString("pincode"));
                user.setCity(resultSet.getString("city"));
                user.setPassword(resultSet.getString("password"));
            }

            return user;
        });
    }

    public void updatePassword(String email, String password) {
        String userEnableQuery = "UPDATE admin SET password = ? WHERE email = ?";
        jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(userEnableQuery);
            statement.setString(1, password);
            statement.setString(2, email);
            return statement;
        });
    }

}
