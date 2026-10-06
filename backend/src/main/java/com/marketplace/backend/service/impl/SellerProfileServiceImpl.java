package com.marketplace.backend.service.impl;

import com.marketplace.backend.dto.request.SellerProfileRequest;
import com.marketplace.backend.dto.response.SellerProfileResponse;
import com.marketplace.backend.entity.SellerProfile;
import com.marketplace.backend.entity.User;
import com.marketplace.backend.enums.Role;
import com.marketplace.backend.enums.SellerStatus;
import com.marketplace.backend.exception.DuplicateResourceException;
import com.marketplace.backend.exception.ResourceNotFoundException;
import com.marketplace.backend.mapper.SellerProfileMapper;
import com.marketplace.backend.repository.SellerProfileRepository;
import com.marketplace.backend.repository.UserRepository;
import com.marketplace.backend.service.SellerProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SellerProfileServiceImpl implements SellerProfileService {

    private final SellerProfileRepository sellerProfileRepository;
    private final UserRepository userRepository;
    private final SellerProfileMapper sellerProfileMapper;

    @Override
    @Transactional
    public SellerProfileResponse createProfile(
            String email,
            SellerProfileRequest request
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (sellerProfileRepository.findByUser(user).isPresent()) {
            throw new DuplicateResourceException(
                    "Seller profile already exists"
            );
        }

        SellerProfile profile = SellerProfile.builder()
                .shopName(request.getShopName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .description(request.getDescription())
                .verified(false)
                .status(SellerStatus.PENDING)
                .user(user)
                .build();

        SellerProfile savedProfile =
                sellerProfileRepository.save(profile);




        return sellerProfileMapper.toResponse(savedProfile);
    }


    @Override
    public SellerProfileResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SellerProfile profile = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Seller profile not found"));

        return sellerProfileMapper.toResponse(profile);
    }

    @Override
    public SellerProfileResponse updateProfile(String email, SellerProfileRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SellerProfile profile = sellerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Seller profile not found"));

        profile.setShopName(request.getShopName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setDescription(request.getDescription());

        sellerProfileRepository.save(profile);

        return sellerProfileMapper.toResponse(profile);
    }
}
