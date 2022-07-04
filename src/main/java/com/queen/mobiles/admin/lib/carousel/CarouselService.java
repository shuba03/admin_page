package com.queen.mobiles.admin.lib.carousel;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.queen.mobiles.admin.lib.common.APIException;
import com.queen.mobiles.admin.lib.common.Image;

@Service
public class CarouselService {

    @Autowired
    private CarouselRepository repository;

    public List<String> getCarouselIds() {
        return this.repository.getCarouselIds();
    }

    public Image getCarouselImage(String id) {
        return this.repository.getCarouselImage(id);
    }

    public void insertCarouselImage(MultipartFile file) throws IOException {
        long size = file.getSize();

        if (size > 10485760) {
            throw new APIException("File size should be less than 5 mb", HttpStatus.BAD_REQUEST.value());
        }

        this.repository.insertCarouselImage(file.getOriginalFilename(), file.getBytes(), file.getContentType(),
                UUID.randomUUID().toString());
    }

    public void deleteCarouselImage(String id) {
        this.repository.deleteCarouselImage(id);
    }

}
