package com.queen.mobiles.admin.lib.user;

import com.queen.mobiles.admin.lib.util.Utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    

    @GetMapping("/info")
    public ResponseEntity<User> getUser() {
        return ResponseEntity.ok().body(Utils.getActiveUser());
    }
        
}
