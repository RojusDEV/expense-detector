package com.expensedetector.backend.payload.response;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageResponse {
    @NotBlank
    private String message;
    public MessageResponse(String message) {
        this.message = message;
    }
}
