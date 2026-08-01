package com.expensedetector.backend.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException() {
        super("Refresh token is invalid or expired");
    }

    public InvalidTokenException(String message) {
        super(message);
    }
}
