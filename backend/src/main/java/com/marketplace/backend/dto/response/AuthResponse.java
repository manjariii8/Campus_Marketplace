package com.marketplace.backend.dto.response;

import com.marketplace.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private String token;
    private String message;
    private Long id;

    private String name;

    private String email;

    private Role role;

    // Campus information
    private Long campusId;
    private String campusName;
    private String campusCity;
    private String campusState;
}