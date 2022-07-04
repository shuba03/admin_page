package com.queen.mobiles.admin.lib.common;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class APIResponse {
    private int code;
    private String status;
    private String message;

    private Object data;
}
