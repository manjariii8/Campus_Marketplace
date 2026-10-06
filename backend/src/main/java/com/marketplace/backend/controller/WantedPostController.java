package com.marketplace.backend.controller;

import com.marketplace.backend.dto.request.WantedPostRequest;
import com.marketplace.backend.dto.response.ProductResponse;
import com.marketplace.backend.dto.response.WantedPostResponse;
import com.marketplace.backend.service.WantedPostService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wanted-posts")
@RequiredArgsConstructor
public class WantedPostController {

    private final WantedPostService wantedPostService;

    // Create a new wanted post.
    @PostMapping
    public WantedPostResponse create(
            Authentication authentication,
            @Valid @RequestBody WantedPostRequest request) {

        return wantedPostService.create(
                authentication.getName(),
                request
        );
    }

    // View active wanted posts from the authenticated user's campus.
    @GetMapping
    public List<WantedPostResponse> getActivePosts(
            Authentication authentication) {

        return wantedPostService.getActivePosts(
                authentication.getName()
        );
    }

    // View the authenticated user's own posts.
    @GetMapping("/mine")
    public List<WantedPostResponse> getMine(
            Authentication authentication) {

        return wantedPostService.getMyPosts(
                authentication.getName()
        );
    }

    // Find products matching one of the user's own posts.
    @GetMapping("/{id}/matches")
    public List<ProductResponse> getMatches(
            @PathVariable Long id,
            Authentication authentication) {

        return wantedPostService.findMatches(
                id,
                authentication.getName()
        );
    }
}