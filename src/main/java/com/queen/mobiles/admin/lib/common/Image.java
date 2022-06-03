package com.queen.mobiles.admin.lib.common;

import lombok.Data;

@Data
public class Image {
    private byte[] data;
    private String fileName;
    private String mime;
}
