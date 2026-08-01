package com.expensedetector.backend.payload.response;

import lombok.Data;

import java.util.UUID;

@Data
public class JwtResponse {
    private UUID id;
    private String name;
    private String email;
    private String role;
    private String refreshToken;

    public JwtResponse(UUID id, String name, String email, String role, String refreshToken) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.refreshToken = refreshToken;
    }
}