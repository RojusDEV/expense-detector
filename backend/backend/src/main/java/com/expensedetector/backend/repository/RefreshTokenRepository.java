package com.expensedetector.backend.repository;

import com.expensedetector.backend.model.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;


public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByTokenAndExpiryDateAfter(String token, Instant now);

    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.token = :token")
    int removeRefreshTokenByToken(@Param("token") String token);
}
