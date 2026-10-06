package com.marketplace.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class WishlistResponse {

    private Long id;

    private Long productId;

    private String productName;

    private BigDecimal price;

    private String categoryName;

    // Product image stored as Base64 data
    private String imageData;
}
