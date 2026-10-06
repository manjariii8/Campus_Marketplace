package com.marketplace.backend.service.impl;

import com.marketplace.backend.dto.response.WishlistResponse;
import com.marketplace.backend.entity.Product;
import com.marketplace.backend.entity.User;
import com.marketplace.backend.entity.Wishlist;
import com.marketplace.backend.exception.ResourceNotFoundException;
import com.marketplace.backend.repository.ProductRepository;
import com.marketplace.backend.repository.UserRepository;
import com.marketplace.backend.repository.WishlistRepository;
import com.marketplace.backend.service.WishlistService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));
    }

    @Override
    public void addToWishlist(Long productId) {

        User user = getCurrentUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        ));

        if (wishlistRepository
                .findByUserAndProduct(user, product)
                .isPresent()) {

            return;
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();

        wishlistRepository.save(wishlist);
    }

    @Override
    public void removeFromWishlist(Long productId) {

        User user = getCurrentUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        ));

        wishlistRepository.deleteByUserAndProduct(
                user,
                product
        );
    }

    @Override
    public List<WishlistResponse> getWishlist() {

        User user = getCurrentUser();

        return wishlistRepository.findByUser(user)
                .stream()
                .map(item -> WishlistResponse.builder()
                        .id(item.getId())
                        .productId(
                                item.getProduct().getId()
                        )
                        .productName(
                                item.getProduct().getName()
                        )
                        .price(
                                item.getProduct().getPrice()
                        )
                        .categoryName(
                                item.getProduct()
                                        .getCategory()
                                        .getName()
                        )
                        .imageData(
                                item.getProduct()
                                        .getImageData()
                        )
                        .build())
                .toList();
    }

    @Override
    public boolean isInWishlist(Long productId) {

        User user = getCurrentUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        ));

        return wishlistRepository
                .findByUserAndProduct(user, product)
                .isPresent();
    }
}
