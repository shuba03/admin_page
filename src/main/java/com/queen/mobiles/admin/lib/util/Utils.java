package com.queen.mobiles.admin.lib.util;

import com.queen.mobiles.admin.lib.user.User;
import com.queen.mobiles.admin.lib.user.UserAuthDetail;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class Utils {

    public static User getActiveUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(auth == null || auth.getPrincipal() == null) {
            return null;
        }

        UserAuthDetail user = (UserAuthDetail) auth.getPrincipal();
        return user.getUser();
    }
    
}
