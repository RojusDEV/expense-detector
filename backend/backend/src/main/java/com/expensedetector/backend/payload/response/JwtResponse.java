package com.expensedetector.backend.payload.response;

import lombok.Data;

import java.util.UUID;

@Data
public class JwtResponse {
    private UUID id;
    private String name;
    private String email;
    private String role;

    public JwtResponse(UUID id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
