package com.marketplace.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WantedPostRequest {

    @NotBlank(message = "Title is required")
    @Size(
            min = 3,
            max = 120,
            message = "Title must be between 3 and 120 characters"
    )
    private String title;

    @Size(
            max = 1500,
            message = "Description cannot exceed 1500 characters"
    )
    private String description;

    @Size(
            max = 3000000,
            message = "Image data is too large"
    )
    private String imageData;

    @NotNull(message = "Maximum budget is required")
    @DecimalMin(
            value = "0.01",
            message = "Maximum budget must be greater than zero"
    )
    @Digits(
            integer = 8,
            fraction = 2,
            message = "Invalid budget format"
    )
    private BigDecimal maxBudget;

    private Long categoryId;
}
