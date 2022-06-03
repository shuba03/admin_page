package com.queen.mobiles.admin.lib.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class User {
    private String id;
    private String name;
    private String address;
    private String city;
    private String pincode;
    private String email;
    private String phone;

    private String password;
}