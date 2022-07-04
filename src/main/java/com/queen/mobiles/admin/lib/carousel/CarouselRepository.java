package com.queen.mobiles.admin.lib.carousel;

import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.queen.mobiles.admin.lib.common.Image;

@Repository
public class CarouselRepository {

    @Autowired
    private JdbcTemplate jdbc;

    public List<String> getCarouselIds() {
        String query = "SELECT id FROM carousel";

        return jdbc.query(query, resultSet -> {
            List<String> carouselIds = new ArrayList<>();
            while (resultSet.next()) {
                carouselIds.add(resultSet.getString("id"));
            }
            return carouselIds;
        });
    }

    public void insertCarouselImage(String name, byte[] bytes, String contentType, String id) {
        String query = "INSERT INTO carousel (name, image, mime_type, id) VALUES (?, ?, ?, ?) ";

        jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, name);
            statement.setBlob(2, new SerialBlob(bytes));
            statement.setString(3, contentType);
            statement.setString(4, id);
            return statement;
        });
    }

    public void deleteCarouselImage(String id) {
        String query = "DELETE FROM carousel WHERE id = ?";

        jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, id);
            return statement;
        });
    }

    public Image getCarouselImage(String id) {
        String query = "SELECT name, image, mime_type FROM carousel WHERE id = ?";

        return jdbc.query(connection -> {
            PreparedStatement statement = connection.prepareStatement(query);
            statement.setString(1, id);
            return statement;
        }, resultSet -> {
            Image image = null;
            if (resultSet.next()) {
                image = new Image();
                image.setData(resultSet.getBytes("image"));
                image.setMime(resultSet.getString("mime_type"));
                image.setFileName(resultSet.getString("name"));
            }

            return image;
        });
    }
}
