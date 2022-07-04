package com.queen.mobiles.admin.lib.util;

import com.queen.mobiles.admin.lib.common.APIException;
import com.queen.mobiles.admin.lib.common.APIResponse;
import com.queen.mobiles.admin.lib.user.User;
import com.queen.mobiles.admin.lib.user.UserAuthDetail;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class Utils {

    public static User getActiveUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            return null;
        }

        UserAuthDetail user = (UserAuthDetail) auth.getPrincipal();
        return user.getUser();
    }

    public static ResponseEntity<APIResponse> getResponseFromError(Throwable err) {
        err.printStackTrace();
        int httpCode = 500;
        String status = "failed";
        String message = err.getMessage();
        Map<String, Object> errDetails = new HashMap<>();

        if (err instanceof APIException) {
            APIException apiException = (APIException) err;
            httpCode = apiException.getHttpCode();
            errDetails = apiException.getErrorDetails();
        }

        // Get all the nested error details
        List<String> causes = new ArrayList<>();
        Throwable e = err;
        while (e != null) {
            if ((e.getCause() != null)) {
                causes.add(e.getCause().getMessage());
            }

            e = e.getCause();
        }
        errDetails.put("ERR_STACK", causes);

        return ResponseEntity
                .status(HttpStatus.valueOf(httpCode))
                .body(APIResponse.builder().code(httpCode).status(status).data(errDetails).message(message).build());
    }

}
