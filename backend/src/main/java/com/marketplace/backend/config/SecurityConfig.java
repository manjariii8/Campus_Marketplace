package com.marketplace.backend.config;

import com.marketplace.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // CORS: allow cross-origin requests according to CORS configuration
                .cors(cors -> {})

                // CSRF: disabled for a stateless JWT-based API
                .csrf(csrf -> csrf.disable())

                // Do not create HTTP sessions; authenticate API requests using JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Define which requests are public and which require authorization
                .authorizeHttpRequests(auth -> auth

                        // Allow browser CORS preflight requests
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Login, registration and API documentation
                        .requestMatchers(
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Public campus browsing
                        // Required during registration before the user has a JWT
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/campuses",
                                "/api/campuses/**"
                        ).permitAll()

                        /*
                         * Campus marketplace:
                         *
                         * Product browsing is authenticated because
                         * products must be restricted to the user's campus.
                         */
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products",
                                "/api/products/search"
                        ).authenticated()

                        /*
                         * Specific seller endpoint must come before /{id}.
                         */
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/my-products"
                        ).hasRole("SELLER")

                        /*
                         * Product details are also campus-protected.
                         */
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/{id}"
                        ).authenticated()

                        // Public category browsing
                        // All other category operations are admin-only
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/categories/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        // Admin-only endpoints
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // A logged-in user may apply to become a seller
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/seller/profile"
                        ).authenticated()

                        // Other seller endpoints require the SELLER role
                        .requestMatchers(
                                "/api/seller/**"
                        ).hasRole("SELLER")

                        // Create, update and delete products: sellers only
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products"
                        ).hasRole("SELLER")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/**"
                        ).hasRole("SELLER")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/**"
                        ).hasRole("SELLER")

                        /*
                         * Wanted posts:
                         *
                         * The feed is now authenticated because the backend
                         * uses the logged-in user's campus to filter posts.
                         */
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/wanted-posts"
                        ).authenticated()

                        /*
                         * Creating posts, viewing own posts and finding
                         * matches also require authentication.
                         */
                        .requestMatchers(
                                "/api/wanted-posts/**"
                        ).authenticated()

                        // Personal and transactional endpoints
                        .requestMatchers(
                                "/api/cart/**",
                                "/api/orders/**",
                                "/api/wishlist/**",
                                "/api/payments/**"
                        ).authenticated()

                        // Secure by default: all other requests require login
                        .anyRequest().authenticated()
                )

                // Configure the application's authentication provider
                .authenticationProvider(authenticationProvider)

                // Validate JWTs before Spring's username/password filter
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
