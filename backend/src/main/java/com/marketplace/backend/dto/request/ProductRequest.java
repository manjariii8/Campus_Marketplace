package com.marketplace.backend.dto.request;

import com.marketplace.backend.enums.ItemCondition;
import com.marketplace.backend.enums.ListingType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(
            min = 3,
            max = 100,
            message = "Product name must be between 3 and 100 characters"
    )
    private String name;

    @Size(
            max = 2000,
            message = "Description cannot exceed 2000 characters"
    )
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(
            value = "0.0",
            message = "Price must be greater than 0"
    )
    private BigDecimal price;

    @NotNull(message = "Stock is required")
    @Min(
            value = 0,
            message = "Stock cannot be negative"
    )
    private Integer stock;

    @NotNull(message = "Category is required")
    private Long categoryId;

    // NEW
    private String imageData;

    private ItemCondition condition = ItemCondition.GOOD;

    private ListingType listingType = ListingType.ITEM;

    @Size(max = 1000, message = "Defects cannot exceed 1000 characters")
    private String defects;

    @Size(max = 120, message = "Pickup location cannot exceed 120 characters")
    private String pickupLocation;

    @Size(max = 100, message = "Course cannot exceed 100 characters")
    private String course;

    @Size(max = 100, message = "Subject cannot exceed 100 characters")
    private String subject;

    @Min(value = 1, message = "Semester must be at least 1")
    @Max(value = 12, message = "Semester cannot exceed 12")
    private Integer semester;
}