package com.marketplace.backend.dto.request;

import com.marketplace.backend.enums.ItemCondition;
import com.marketplace.backend.enums.ListingType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductFilterRequest {

    private String keyword;

    private Long categoryId;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Long sellerId;

    private ItemCondition condition;

    private ListingType listingType;

    private String course;

    private String subject;

    private Integer semester;

    private Integer page = 0;

    private Integer size = 10;

    private String sortBy = "createdAt";

    private String direction = "desc";
}
