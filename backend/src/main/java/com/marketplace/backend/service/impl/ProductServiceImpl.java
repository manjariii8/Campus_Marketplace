package com.marketplace.backend.service.impl;

import com.marketplace.backend.dto.request.ProductFilterRequest;
import com.marketplace.backend.dto.request.ProductRequest;
import com.marketplace.backend.dto.response.ProductResponse;
import com.marketplace.backend.entity.Category;
import com.marketplace.backend.entity.Product;
import com.marketplace.backend.entity.SellerProfile;
import com.marketplace.backend.entity.User;
import com.marketplace.backend.enums.SellerStatus;
import com.marketplace.backend.exception.BadRequestException;
import com.marketplace.backend.exception.ResourceNotFoundException;
import com.marketplace.backend.mapper.ProductMapper;
import com.marketplace.backend.repository.CategoryRepository;
import com.marketplace.backend.repository.ProductRepository;
import com.marketplace.backend.repository.SellerProfileRepository;
import com.marketplace.backend.repository.UserRepository;
import com.marketplace.backend.service.ProductService;
import com.marketplace.backend.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponse createProduct(
            String email,
            ProductRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        SellerProfile seller = sellerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller profile not found"));

        if (seller.getStatus() != SellerStatus.APPROVED) {
            throw new BadRequestException(
                    "Your seller profile must be approved before listing products"
            );
        }

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"));

        /*
         * Product is active only when stock is greater than 0.
         */
        boolean active = request.getStock() != null
                && request.getStock() > 0;

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .active(active)
                .imageData(request.getImageData())
                .condition(
                        request.getCondition() == null
                                ? com.marketplace.backend.enums.ItemCondition.GOOD
                                : request.getCondition()
                )
                .listingType(
                        request.getListingType() == null
                                ? com.marketplace.backend.enums.ListingType.ITEM
                                : request.getListingType()
                )
                .defects(request.getDefects())
                .pickupLocation(request.getPickupLocation())
                .course(request.getCourse())
                .subject(request.getSubject())
                .semester(request.getSemester())
                .seller(seller)
                .category(category)
                .build();

        product = productRepository.save(product);

        return productMapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(String email) {

        User user = getUser(email);

        Long campusId = getUserCampusId(user);

        Specification<Product> specification =
                Specification.where(ProductSpecification.isActive())
                        .and(ProductSpecification.inStock())
                        .and(hasCampus(campusId));

        return productRepository
                .findAll(specification)
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsBySeller(String email) {

        SellerProfile seller = sellerProfileRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller profile not found for email: " + email
                        )
                );

        List<Product> products =
                productRepository.findBySeller_Id(seller.getId());

        return products.stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(
            Long id,
            String email) {

        User user = getUser(email);

        Long campusId = getUserCampusId(user);

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        ));

        /*
         * Security check:
         * A user cannot directly access a product
         * belonging to another campus.
         */
        Long productCampusId =
                product.getSeller()
                        .getUser()
                        .getCampus()
                        .getId();

        if (!campusId.equals(productCampusId)) {
            throw new ResourceNotFoundException(
                    "Product not found"
            );
        }

        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse updateProduct(
            Long id,
            String email,
            ProductRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        SellerProfile seller = sellerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller profile not found"));

        Product product = productRepository
                .findByIdAndSellerId(id, seller.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found or access denied"));

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);
        product.setImageData(request.getImageData());

        product.setCondition(
                request.getCondition() == null
                        ? com.marketplace.backend.enums.ItemCondition.GOOD
                        : request.getCondition()
        );

        product.setListingType(
                request.getListingType() == null
                        ? com.marketplace.backend.enums.ListingType.ITEM
                        : request.getListingType()
        );

        product.setDefects(request.getDefects());
        product.setPickupLocation(request.getPickupLocation());
        product.setCourse(request.getCourse());
        product.setSubject(request.getSubject());
        product.setSemester(request.getSemester());

        /*
         * Automatically determine product status from stock.
         */
        product.setActive(
                request.getStock() != null &&
                        request.getStock() > 0
        );

        productRepository.save(product);

        log.info(
                "Product updated. ProductId={}, SellerId={}, Stock={}, Active={}",
                product.getId(),
                seller.getId(),
                product.getStock(),
                product.getActive()
        );

        return productMapper.toResponse(product);
    }

    @Override
    public void deleteProduct(
            Long id,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        SellerProfile seller = sellerProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seller profile not found"));

        Product product = productRepository
                .findByIdAndSellerId(id, seller.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found or access denied"));

        productRepository.delete(product);

        log.info(
                "Product deleted. ProductId={}, SellerId={}",
                product.getId(),
                seller.getId()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(
            ProductFilterRequest filter,
            String email) {

        User user = getUser(email);

        Long campusId = getUserCampusId(user);

        String sortBy = filter.getSortBy();
        String direction = filter.getDirection();

        /*
         * Map frontend sort options to valid Product entity fields.
         */
        if ("priceDesc".equalsIgnoreCase(sortBy)) {

            sortBy = "price";
            direction = "desc";

        } else if ("price".equalsIgnoreCase(sortBy)) {

            direction = "desc".equalsIgnoreCase(direction)
                    ? "desc"
                    : "asc";

        } else if ("name".equalsIgnoreCase(sortBy)) {

            direction = "asc";

        } else {

            sortBy = "createdAt";
            direction = "desc";
        }

        Sort sort =
                "desc".equalsIgnoreCase(direction)
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(
                Math.max(filter.getPage(), 0),
                Math.max(filter.getSize(), 1),
                sort
        );

        /*
         * Campus isolation is applied together with
         * all existing marketplace filters.
         */
        Specification<Product> specification =
                Specification.where(ProductSpecification.isActive())
                        .and(ProductSpecification.hasKeyword(
                                filter.getKeyword()
                        ))
                        .and(ProductSpecification.hasCategory(
                                filter.getCategoryId()
                        ))
                        .and(ProductSpecification.hasMinPrice(
                                filter.getMinPrice()
                        ))
                        .and(ProductSpecification.hasMaxPrice(
                                filter.getMaxPrice()
                        ))
                        .and(ProductSpecification.hasSeller(
                                filter.getSellerId()
                        ))
                        .and(ProductSpecification.hasCondition(
                                filter.getCondition()
                        ))
                        .and(ProductSpecification.hasListingType(
                                filter.getListingType()
                        ))
                        .and(ProductSpecification.hasCourse(
                                filter.getCourse()
                        ))
                        .and(ProductSpecification.hasSubject(
                                filter.getSubject()
                        ))
                        .and(ProductSpecification.hasSemester(
                                filter.getSemester()
                        ))
                        .and(ProductSpecification.inStock())
                        .and(hasCampus(campusId));

        return productRepository
                .findAll(specification, pageable)
                .map(productMapper::toResponse);
    }

    /**
     * Finds the authenticated user.
     */
    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));
    }

    /**
     * Gets the campus ID belonging to the authenticated user.
     */
    private Long getUserCampusId(User user) {

        if (user.getCampus() == null ||
                user.getCampus().getId() == null) {

            throw new BadRequestException(
                    "Your account is not associated with a campus"
            );
        }

        return user.getCampus().getId();
    }

    /**
     * Restricts products to sellers who belong
     * to the specified campus.
     *
     * Product relationship:
     *
     * Product
     *   -> SellerProfile
     *       -> User
     *           -> Campus
     */
    private Specification<Product> hasCampus(Long campusId) {

        return (root, query, cb) -> {

            if (campusId == null) {
                return cb.disjunction();
            }

            return cb.equal(
                    root.get("seller")
                            .get("user")
                            .get("campus")
                            .get("id"),
                    campusId
            );
        };
    }
}