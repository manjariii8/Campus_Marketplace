package com.marketplace.backend.dto.response;

import com.marketplace.backend.enums.ItemCondition;
import com.marketplace.backend.enums.ListingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer stock;

    private Boolean active;

    private String sellerName;

    private String categoryName;

    private String imageData;

    private ItemCondition condition;

    private ListingType listingType;

    private String defects;

    private String pickupLocation;

    private String course;

    private String subject;

    private Integer semester;
}