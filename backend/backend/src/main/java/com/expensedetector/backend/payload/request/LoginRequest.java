package com.expensedetector.backend.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.jspecify.annotations.Nullable;

@Data
public class LoginRequest {

    @Email
    @NotBlank
    @Size(max = 50)
    private String email;

    @NotBlank
    private String password;

    public @Nullable Object getEmail() {
        return email;
    }
}