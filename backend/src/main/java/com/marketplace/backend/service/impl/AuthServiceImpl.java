package com.marketplace.backend.service.impl;

import com.marketplace.backend.dto.request.LoginRequest;
import com.marketplace.backend.dto.request.RegisterRequest;
import com.marketplace.backend.dto.response.AuthResponse;
import com.marketplace.backend.entity.Campus;
import com.marketplace.backend.entity.User;
import com.marketplace.backend.enums.Role;
import com.marketplace.backend.exception.DuplicateResourceException;
import com.marketplace.backend.exception.ResourceNotFoundException;
import com.marketplace.backend.repository.CampusRepository;
import com.marketplace.backend.repository.UserRepository;
import com.marketplace.backend.service.AuthService;
import com.marketplace.backend.util.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CampusRepository campusRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email is already registered"
            );
        }

        // Find the campus selected during registration
        Campus campus = campusRepository.findById(request.getCampusId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Selected campus not found"
                        )
                );

        // Only active campuses can accept new users
        if (!Boolean.TRUE.equals(campus.getActive())) {
            throw new IllegalArgumentException(
                    "Selected campus is currently inactive"
            );
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(Role.CUSTOMER)
                .campus(campus)
                .build();

        userRepository.save(user);

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build();

        String token = jwtService.generateToken(userDetails);

        return buildAuthResponse(
                token,
                "Registration successful",
                user
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build();

        String token = jwtService.generateToken(userDetails);

        log.info(
                "User logged in successfully. Email={}",
                request.getEmail()
        );

        return buildAuthResponse(
                token,
                "Login successful",
                user
        );
    }

    /**
     * Builds the authentication response including
     * the user's campus information.
     */
    private AuthResponse buildAuthResponse(
            String token,
            String message,
            User user
    ) {

        Campus campus = user.getCampus();

        return new AuthResponse(
                token,
                message,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                campus != null ? campus.getId() : null,
                campus != null ? campus.getName() : null,
                campus != null ? campus.getCity() : null,
                campus != null ? campus.getState() : null
        );
    }
}