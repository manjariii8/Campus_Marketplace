package com.marketplace.backend.service.impl;

import com.marketplace.backend.dto.request.WantedPostRequest;
import com.marketplace.backend.dto.response.ProductResponse;
import com.marketplace.backend.dto.response.WantedPostResponse;
import com.marketplace.backend.entity.Category;
import com.marketplace.backend.entity.Product;
import com.marketplace.backend.entity.User;
import com.marketplace.backend.entity.WantedPost;
import com.marketplace.backend.exception.BadRequestException;
import com.marketplace.backend.exception.ResourceNotFoundException;
import com.marketplace.backend.mapper.ProductMapper;
import com.marketplace.backend.repository.CategoryRepository;
import com.marketplace.backend.repository.ProductRepository;
import com.marketplace.backend.repository.UserRepository;
import com.marketplace.backend.repository.WantedPostRepository;
import com.marketplace.backend.service.WantedPostService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WantedPostServiceImpl implements WantedPostService {

    private final WantedPostRepository wantedPostRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public WantedPostResponse create(
            String email,
            WantedPostRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getCampus() == null ||
                user.getCampus().getId() == null) {

            throw new BadRequestException(
                    "Your account is not associated with a campus"
            );
        }

        Category category = null;

        if (request.getCategoryId() != null) {

            category = categoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Category not found"
                            ));
        }

        WantedPost post = WantedPost.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .imageData(request.getImageData())
                .maxBudget(request.getMaxBudget())
                .category(category)
                .user(user)
                .active(true)
                .build();

        WantedPost savedPost =
                wantedPostRepository.save(post);

        return toResponse(savedPost);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WantedPostResponse> getMyPosts(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        return wantedPostRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WantedPostResponse> getActivePosts(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        Long campusId = getUserCampusId(user);

        return wantedPostRepository
                .findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .filter(post ->
                        post.getUser() != null &&
                                post.getUser().getCampus() != null &&
                                post.getUser().getCampus().getId() != null &&
                                campusId.equals(
                                        post.getUser()
                                                .getCampus()
                                                .getId()
                                )
                )
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> findMatches(
            Long postId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        WantedPost post = wantedPostRepository
                .findById(postId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Wanted post not found"
                        ));

        // Only the owner can view matches.
        if (!post.getUser().getId().equals(user.getId())) {

            throw new AccessDeniedException(
                    "You can only view matches for your own wanted post"
            );
        }

        Long campusId = getUserCampusId(user);

        /*
         * Start with active products.
         */
        Specification<Product> spec =
                (root, query, cb) ->
                        cb.isTrue(root.get("active"));

        /*
         * Product must have stock greater than 0.
         */
        spec = spec.and(
                (root, query, cb) ->
                        cb.greaterThan(
                                root.get("stock"),
                                0
                        )
        );

        /*
         * Product price must be <= wanted post budget.
         */
        spec = spec.and(
                (root, query, cb) ->
                        cb.lessThanOrEqualTo(
                                root.get("price"),
                                post.getMaxBudget()
                        )
        );

        /*
         * Product must belong to the same campus
         * as the wanted post owner.
         *
         * Product relationship:
         *
         * Product
         *   -> SellerProfile
         *      -> User
         *         -> Campus
         */
        spec = spec.and(
                (root, query, cb) ->
                        cb.equal(
                                root.get("seller")
                                        .get("user")
                                        .get("campus")
                                        .get("id"),
                                campusId
                        )
        );

        /*
         * If the user selected a category,
         * product category must match it.
         */
        if (post.getCategory() != null) {

            Long categoryId =
                    post.getCategory().getId();

            spec = spec.and(
                    (root, query, cb) ->
                            cb.equal(
                                    root.get("category")
                                            .get("id"),
                                    categoryId
                            )
            );
        }

        return productRepository
                .findAll(
                        spec,
                        Sort.by(
                                Sort.Direction.DESC,
                                "createdAt"
                        )
                )
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    private Long getUserCampusId(User user) {

        if (user.getCampus() == null ||
                user.getCampus().getId() == null) {

            throw new BadRequestException(
                    "Your account is not associated with a campus"
            );
        }

        return user.getCampus().getId();
    }

    private WantedPostResponse toResponse(
            WantedPost post) {

        return WantedPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .description(post.getDescription())
                .imageData(post.getImageData())
                .maxBudget(post.getMaxBudget())
                .categoryId(
                        post.getCategory() == null
                                ? null
                                : post.getCategory().getId()
                )
                .categoryName(
                        post.getCategory() == null
                                ? null
                                : post.getCategory().getName()
                )
                .requesterName(
                        post.getUser().getName()
                )
                .active(post.getActive())
                .createdAt(post.getCreatedAt())
                .build();
    }
}
