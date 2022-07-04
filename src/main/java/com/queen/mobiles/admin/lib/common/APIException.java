package com.queen.mobiles.admin.lib.common;

import java.util.HashMap;
import java.util.Map;

public class APIException extends Error {

    private int httpCode;
    private Map<String, Object> details;

    public APIException(String message, int httpCode) {
        super(message);
        this.httpCode = httpCode;
        this.details = new HashMap<>();
    }

    public APIException(String message) {
        this(message, 500);
    }

    public APIException addDetails(Map<String, Object> details) {
        this.details.putAll(details);
        return this;
    }

    public APIException addDetail(String key, Object data) {
        this.details.put(key, data);
        return this;
    }

    public int getHttpCode() {
        return this.httpCode;
    }

    public Map<String, Object> getErrorDetails() {
        return this.details;
    }
}
