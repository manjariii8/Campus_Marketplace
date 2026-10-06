package com.marketplace.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class WantedPostResponse {

    private Long id;

    private String title;

    private String description;

    private String imageData;

    private BigDecimal maxBudget;

    private Long categoryId;

    private String categoryName;

    private String requesterName;

    private Boolean active;

    private LocalDateTime createdAt;
}
