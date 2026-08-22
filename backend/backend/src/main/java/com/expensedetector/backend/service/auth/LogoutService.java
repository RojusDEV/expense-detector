package com.expensedetector.backend.service.auth;

import com.expensedetector.backend.repository.RefreshTokenRepository;
import com.expensedetector.backend.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LogoutService {
    private final JwtUtils jwtUtils;
    private final RefreshTokenRepository refreshTokenRepository;

    public LogoutService(JwtUtils jwtUtils, RefreshTokenRepository refreshTokenRepository) {
        this.jwtUtils = jwtUtils;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String requestToken = jwtUtils.getRefreshTokenFromCookies(request);

        if (requestToken != null && !requestToken.isBlank()) {
            refreshTokenRepository.removeRefreshTokenByToken(requestToken);
        }

        response.addHeader(HttpHeaders.SET_COOKIE, buildClearCookie("expense", "/api", false).toString());
        response.addHeader(HttpHeaders.SET_COOKIE, buildClearCookie("refreshToken", "/api/auth/refresh", true).toString());

        return ResponseEntity.ok().body("Logged out successfully");
    }

    private ResponseCookie buildClearCookie(String name, String path, boolean strictSameSite) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(name, "")
                .path(path)
                .maxAge(0)
                .httpOnly(true)
                .secure(true);

        if (strictSameSite) {
            builder.sameSite("Strict");
        }

        return builder.build();
    }
}