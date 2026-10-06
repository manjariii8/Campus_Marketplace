package com.marketplace.backend.specification;

import com.marketplace.backend.entity.Product;
import com.marketplace.backend.enums.ItemCondition;
import com.marketplace.backend.enums.ListingType;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public final class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> hasKeyword(String keyword) {

        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return cb.conjunction();
            }

            return cb.like(
                    cb.lower(root.get("name")),
                    "%" + keyword.toLowerCase() + "%"
            );
        };
    }

    public static Specification<Product> hasCategory(Long categoryId) {

        return (root, query, cb) -> {

            if (categoryId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("category").get("id"),
                    categoryId
            );
        };

    }

    public static Specification<Product> hasMinPrice(BigDecimal minPrice) {

        return (root, query, cb) -> {

            if (minPrice == null) {
                return cb.conjunction();
            }

            return cb.greaterThanOrEqualTo(
                    root.get("price"),
                    minPrice
            );
        };
    }

    public static Specification<Product> hasMaxPrice(BigDecimal maxPrice) {

        return (root, query, cb) -> {

            if (maxPrice == null) {
                return cb.conjunction();
            }

            return cb.lessThanOrEqualTo(
                    root.get("price"),
                    maxPrice
            );
        };
    }

    public static Specification<Product> hasSeller(Long sellerId) {

        return (root, query, cb) -> {

            if (sellerId == null) {
                return cb.conjunction();
            }

            return cb.equal(
                    root.get("seller").get("id"),
                    sellerId
            );
        };
    }
    public static Specification<Product> hasListingType(ListingType listingType) {
        return (root, query, cb) -> listingType == null
                ? cb.conjunction()
                : cb.equal(root.get("listingType"), listingType);
    }

    public static Specification<Product> hasCourse(String course) {
        return (root, query, cb) -> course == null || course.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("course")), course.trim().toLowerCase());
    }

    public static Specification<Product> hasSubject(String subject) {
        return (root, query, cb) -> subject == null || subject.isBlank()
                ? cb.conjunction()
                : cb.equal(cb.lower(root.get("subject")), subject.trim().toLowerCase());
    }

    public static Specification<Product> hasSemester(Integer semester) {
        return (root, query, cb) -> semester == null
                ? cb.conjunction()
                : cb.equal(root.get("semester"), semester);
    }

    public static Specification<Product> hasCondition(ItemCondition condition) {
        return (root, query, cb) -> condition == null
                ? cb.conjunction()
                : cb.equal(root.get("condition"), condition);
    }

    public static Specification<Product> isActive() {

        return (root, query, cb) ->
                cb.isTrue(root.get("active"));
    }
    public static Specification<Product> inStock() {

        return (root, query, cb) ->
                cb.greaterThan(root.get("stock"), 0);
    }
}
