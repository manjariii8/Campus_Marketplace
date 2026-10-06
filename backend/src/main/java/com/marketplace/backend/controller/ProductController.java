package com.marketplace.backend.controller;

import com.marketplace.backend.dto.request.ProductFilterRequest;
import com.marketplace.backend.dto.request.ProductRequest;
import com.marketplace.backend.dto.response.ApiResponse;
import com.marketplace.backend.dto.response.ProductResponse;
import com.marketplace.backend.service.ProductService;
import com.marketplace.backend.util.ResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Create a new product")
    @PostMapping
    public ApiResponse<ProductResponse> createProduct(
            Authentication authentication,
            @Valid @RequestBody ProductRequest request) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Seller authentication is required"
            );
        }

        ProductResponse response =
                productService.createProduct(
                        authentication.getName(),
                        request
                );

        return ResponseUtil.success(
                "Product created successfully",
                response
        );
    }

    @Operation(summary = "Get all products from the user's campus")
    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts(
            Authentication authentication) {

        List<ProductResponse> products =
                productService.getAllProducts(
                        authentication.getName()
                );

        return ResponseUtil.success(
                "Products fetched successfully",
                products
        );
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody ProductRequest request) {

        return productService.updateProduct(
                id,
                authentication.getName(),
                request
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(
            @PathVariable Long id,
            Authentication authentication) {

        productService.deleteProduct(
                id,
                authentication.getName()
        );
    }

    @GetMapping("/search")
    public Page<ProductResponse> searchProducts(
            ProductFilterRequest filter,
            Authentication authentication) {

        return productService.searchProducts(
                filter,
                authentication.getName()
        );
    }

    @GetMapping("/my-products")
    public List<ProductResponse> getMyProducts(
            Authentication authentication) {

        return productService.getProductsBySeller(
                authentication.getName()
        );
    }

    @GetMapping("/{id}")
    public ProductResponse getProduct(
            @PathVariable Long id,
            Authentication authentication) {

        return productService.getProductById(
                id,
                authentication.getName()
        );
    }
}
