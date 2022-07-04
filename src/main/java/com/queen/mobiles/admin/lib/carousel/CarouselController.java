package com.queen.mobiles.admin.lib.carousel;

import java.io.ByteArrayInputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.queen.mobiles.admin.lib.common.APIResponse;
import com.queen.mobiles.admin.lib.common.Image;
import com.queen.mobiles.admin.lib.util.Utils;

@RestController
@RequestMapping("/api/carousel")
public class CarouselController {

    @Autowired
    private CarouselService service;

    @GetMapping("/list")
    public ResponseEntity<List<String>> listCarousels() {
        return ResponseEntity.ok().body(this.service.getCarouselIds());
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<InputStreamResource> listCarousels(@PathVariable String id, HttpServletRequest request,
            HttpServletResponse response) {
        Image image = this.service.getCarouselImage(id);

        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(image.getData()));

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, image.getMime());
        headers.add("original-file-name", image.getFileName());

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(image.getData().length)
                .body(resource);
    }

    @PostMapping("/add-carousel")
    public ResponseEntity<APIResponse> updateProfileImage(@RequestParam("file") MultipartFile file) {
        try {
            this.service.insertCarouselImage(file);

            APIResponse response = APIResponse.builder()
                    .code(HttpStatus.OK.value())
                    .status("success")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Throwable err) {
            return Utils.getResponseFromError(err);
        }
    }

    @DeleteMapping("/carousel/{carouselId}")
    public ResponseEntity<APIResponse> updateProfileImage(@PathVariable String carouselId) {
        try {
            this.service.deleteCarouselImage(carouselId);

            APIResponse response = APIResponse.builder()
                    .code(HttpStatus.OK.value())
                    .status("success")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Throwable err) {
            return Utils.getResponseFromError(err);
        }
    }

}
