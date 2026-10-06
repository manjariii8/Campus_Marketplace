package com.marketplace.backend.service;

import com.marketplace.backend.dto.request.ProductFilterRequest;
import com.marketplace.backend.dto.request.ProductRequest;
import com.marketplace.backend.dto.response.ProductResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(
            String email,
            ProductRequest request
    );

    ProductResponse updateProduct(
            Long id,
            String email,
            ProductRequest request
    );

    void deleteProduct(
            Long id,
            String email
    );

    // Campus-aware product access
    ProductResponse getProductById(
            Long id,
            String email
    );

    Page<ProductResponse> searchProducts(
            ProductFilterRequest filter,
            String email
    );

    List<ProductResponse> getAllProducts(
            String email
    );

    List<ProductResponse> getProductsBySeller(
            String email
    );
}