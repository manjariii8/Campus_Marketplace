package com.marketplace.backend.service;

import com.marketplace.backend.dto.request.WantedPostRequest;
import com.marketplace.backend.dto.response.ProductResponse;
import com.marketplace.backend.dto.response.WantedPostResponse;

import java.util.List;

public interface WantedPostService {

    WantedPostResponse create(
            String email,
            WantedPostRequest request
    );

    List<WantedPostResponse> getMyPosts(
            String email
    );

    /*
     * Returns active wanted posts only from
     * the authenticated user's campus.
     */
    List<WantedPostResponse> getActivePosts(
            String email
    );

    List<ProductResponse> findMatches(
            Long postId,
            String email
    );
}