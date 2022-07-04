package com.queen.mobiles.admin.lib.user;

import com.queen.mobiles.admin.lib.common.APIResponse;
import com.queen.mobiles.admin.lib.common.Image;
import com.queen.mobiles.admin.lib.util.Utils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/info")
    public ResponseEntity<User> getUser() {
        User user = this.userService.getUserInfo();
        return ResponseEntity.ok(user);
    }

    @PostMapping("/change-password")
    public ResponseEntity<APIResponse> changePassword(@RequestBody ChangePassword changePassword) {
        try {
            this.userService.changePassword(changePassword.getOldPassword(), changePassword.getNewPassword());

            APIResponse response = APIResponse.builder()
                    .code(HttpStatus.OK.value())
                    .status("success")
                    .build();
            return ResponseEntity.ok(response);
        } catch (Throwable err) {
            return Utils.getResponseFromError(err);
        }
    }

    @GetMapping("image/{userId}")
    public ResponseEntity<InputStreamResource> getImage(
            @PathVariable String userId, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Image image = this.userService.getUserImage(userId);

        if (image == null) {
            image = new Image();

            File file = ResourceUtils.getFile("classpath:default-user-icon.jpg");
            InputStream in = new FileInputStream(file);
            byte[] data = IOUtils.toByteArray(in);

            image.setData(data);
            image.setFileName("default-user-icon.jpg");
            image.setMime("image/jpeg");
        }

        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(image.getData()));

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, image.getMime());

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(image.getData().length)
                .body(resource);
    }

}
