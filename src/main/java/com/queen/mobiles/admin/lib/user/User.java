package com.queen.mobiles.admin.lib.user;

import lombok.Data;

@Data
public class User {
    private String id;
    private String firstName;
    private String lastName;
    private String address;
    private String city;
    private String pincode;
    private String email;
    private String phone;

    private String password;
}