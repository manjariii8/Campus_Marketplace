

package com.marketplace.backend.service.impl;

import com.marketplace.backend.dto.admin.*;

import com.marketplace.backend.entity.*;
import com.marketplace.backend.enums.Role;
import com.marketplace.backend.enums.SellerStatus;
import com.marketplace.backend.exception.CategoryDeletionException;
import com.marketplace.backend.exception.DuplicateResourceException;
import com.marketplace.backend.exception.ResourceNotFoundException;
import com.marketplace.backend.repository.*;
import com.marketplace.backend.service.AdminService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.marketplace.backend.enums.OrderStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final OrderRepository orderRepository;

    private final SellerProfileRepository sellerProfileRepository;

    private final CategoryRepository categoryRepository;


    @Override
    public DashboardResponse getDashboard() {

        return DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalSellers(userRepository.countByRole(Role.SELLER))
                .totalProducts(productRepository.countByActiveTrue())
                .totalOrders(orderRepository.count())
                .totalRevenue(orderRepository.getTotalRevenue())
                .build();

    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .toList();

    }

    @Override
    public List<UserResponse> searchUsers(String keyword) {

        return userRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        keyword,
                        keyword
                )
                .stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .toList();

    }

    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException(
                    "Admin account cannot be deleted"
            );
        }

        userRepository.delete(user);

    }
    private SellerResponse mapSeller(SellerProfile seller) {

        return SellerResponse.builder()
                .sellerId(seller.getId())
                .userId(seller.getUser().getId())
                .sellerName(seller.getUser().getName())
                .email(seller.getUser().getEmail())
                .businessName(seller.getShopName())
                .phone(seller.getPhone())
                .status(seller.getStatus())
                .build();
    }

    @Override
    public List<SellerResponse> getAllSellers() {

        return sellerProfileRepository.findAll()
                .stream()
                .map(this::mapSeller)
                .toList();

    }

    @Override
    public List<SellerResponse> getPendingSellers() {

        return sellerProfileRepository
                .findByStatus(SellerStatus.PENDING)
                .stream()
                .map(this::mapSeller)
                .toList();
    }


    @Override
    @Transactional
    public void approveSeller(Long sellerId) {
        SellerProfile seller = sellerProfileRepository
                .findById(sellerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seller not found"));

        seller.setStatus(SellerStatus.APPROVED);
        seller.setVerified(true);

        // Update the associated user's role after approval.
        User user = seller.getUser();
        user.setRole(Role.SELLER);
        userRepository.save(user);

        sellerProfileRepository.save(seller);
    }
    @Override
    @Transactional
    public void rejectSeller(Long sellerId) {
        SellerProfile seller = sellerProfileRepository
                .findById(sellerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seller not found"));

        seller.setStatus(SellerStatus.REJECTED);
        seller.setVerified(false);

        // Restore customer access after rejection.
        User user = seller.getUser();
        user.setRole(Role.CUSTOMER);
        userRepository.save(user);

        sellerProfileRepository.save(seller);
    }


    @Override
    public List<ProductResponse> getAllProducts(){

        return productRepository.findAll()
                .stream()
                .map(this::mapProduct)
                .toList();

    }

    @Override
    public List<ProductResponse> searchProducts(String keyword){

        return productRepository
                .findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapProduct)
                .toList();

    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId){

        return productRepository
                .findByCategoryId(categoryId)
                .stream()
                .map(this::mapProduct)
                .toList();

    }

    @Override
    public List<ProductResponse> getProductsBySeller(Long sellerId){

        return productRepository
                .findBySeller_Id(sellerId)
                .stream()
                .map(this::mapProduct)
                .toList();

    }

    @Override
    public void hideProduct(Long productId){

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        product.setActive(false);

        productRepository.save(product);

    }

    @Override
    public void showProduct(Long productId){

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        product.setActive(true);

        productRepository.save(product);

    }

    @Override
    @Transactional
    public void deleteProduct(Long productId){

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));


        productRepository.save(product);

    }
    private ProductResponse mapProduct(Product product){

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory().getName())
                .seller(product.getSeller()
                        .getUser()
                        .getName())
                .price(product.getPrice())
                .stock(product.getStock())
                .active(product.getActive())
                .build();

    }

    private CategoryResponse mapCategory(Category category){

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .totalProducts(
                        productRepository.countByCategoryId(category.getId())
                )
                .build();

    }

    @Override
    public List<CategoryResponse> getAllCategories(){

        return categoryRepository.findAll()
                .stream()
                .map(this::mapCategory)
                .toList();

    }

    @Override
    public List<CategoryResponse> searchCategories(String keyword){

        return categoryRepository
                .findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapCategory)
                .toList();

    }

    @Override
    public CategoryResponse createCategory(Category category){

        if(categoryRepository.findByNameIgnoreCase(category.getName()).isPresent()){
            throw new DuplicateResourceException("Category already exists");
        }

        Category saved = categoryRepository.save(category);

        return mapCategory(saved);

    }

    @Override
    public CategoryResponse updateCategory(Long id, Category category){

        Category existing = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found"));

        existing.setName(category.getName());

        categoryRepository.save(existing);

        return mapCategory(existing);

    }

    @Override
    public void deleteCategory(Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found")
                );

        long productCount =
                categoryRepository.countProductsByCategoryId(categoryId);

        if (productCount > 0) {
            throw new CategoryDeletionException(
                    "Cannot delete this category because products are associated with it."
            );
        }

        categoryRepository.delete(category);
    }

    @Override
    public List<OrderResponse> getAllOrders(){

        return orderRepository.findAll()
                .stream()
                .map(this::mapOrder)
                .toList();

    }

    @Override
    public List<OrderResponse> getOrdersByStatus(OrderStatus status){

        return orderRepository.findByStatus(status)
                .stream()
                .map(this::mapOrder)
                .toList();

    }

    @Override
    public List<OrderResponse> searchOrders(String keyword){

        return orderRepository
                .findByUser_NameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapOrder)
                .toList();

    }

    @Override
    public List<OrderResponse> getRecentOrders(){

        return orderRepository
                .findTop10ByOrderByOrderDateDesc()
                .stream()
                .map(this::mapOrder)
                .toList();

    }

    @Override
    public void updateOrderStatus(
            Long orderId,
            OrderStatus status){

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        order.setStatus(status);
        orderRepository.save(order);

    }
    private OrderResponse mapOrder(Order order) {

        return OrderResponse.builder()
                .id(order.getId())
                .customer(order.getUser().getName())
                .email(order.getUser().getEmail())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .orderDate(order.getOrderDate())
                .build();
    }


}