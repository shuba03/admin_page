package com.queen.mobiles.admin.lib.user;

import lombok.Data;

@Data
public class ChangePassword {
    private String oldPassword;

    private String newPassword;
}
