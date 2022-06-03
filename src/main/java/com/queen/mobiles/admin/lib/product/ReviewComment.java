package com.queen.mobiles.admin.lib.product;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ReviewComment {
    
    private String id;
    private String userId;
    private String review;

    private String userName;
    private LocalDateTime addedAt;
}
