package com.expensedetector.backend.service;

import com.expensedetector.backend.exception.InvalidTokenException;
import com.expensedetector.backend.model.entity.RefreshToken;
import com.expensedetector.backend.model.entity.Users;
import com.expensedetector.backend.repository.RefreshTokenRepository;
import com.expensedetector.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${app.refreshExpirationMs}")
    private long refreshExpirationMs;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public String generateRefreshToken(final UUID userId) {
        final Users user = userRepository.findById(userId).orElseThrow();
        final String newToken = UUID.randomUUID().toString();

        final RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(newToken);
        refreshToken.setExpiryDate(Instant.now().plus(Duration.ofMillis(refreshExpirationMs)));
        refreshToken.setUser(user);

        refreshTokenRepository.save(refreshToken);
        return newToken;
    }

    public UUID validateRefreshTokenAndGetUserId(final String givenToken) {
        final RefreshToken refreshToken = refreshTokenRepository
                .findByTokenAndExpiryDateAfter(givenToken, Instant.now())
                .orElseThrow(InvalidTokenException::new);
        return refreshToken.getUser().getId();
    }
}
