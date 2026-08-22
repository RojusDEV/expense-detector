package com.expensedetector.backend.security.jwt;

import com.expensedetector.backend.security.service.UserDetailsImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Value("${app.jwtCookieName}")
    private String jwtCookieName;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal) {
        String jwt = generateTokenFromUserId(userPrincipal.getId().toString());
        return ResponseCookie.from(jwtCookieName, jwt)
                .path("/api")
                .maxAge(600)
                .httpOnly(true)
                .build();
    }

    public ResponseCookie getCleanRefreshCookie() {
        return ResponseCookie.from(jwtRefreshCookie, "")
                .path("/api/auth/refresh")
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .build();
    }

    public ResponseCookie getCleanJwtCookie() {
        return ResponseCookie.from(jwtCookieName, null)
                .path("/api")
                .build();
    }

    public String getJwtFromCookies(HttpServletRequest request) {
        var cookie = WebUtils.getCookie(request, jwtCookieName);
        if (cookie != null) {
            return cookie.getValue();
        }
        return null;
    }

    @Value("${app.refreshExpirationMs}")
    private long refreshExpirationMs;

    @Value("${expensedetector.app.jwtRefreshCookieName:refreshToken}")
    private String jwtRefreshCookie;

    public ResponseCookie generateRefreshCookie(String refreshToken) {
        return ResponseCookie.from(jwtRefreshCookie, refreshToken)
                .path("/api/auth")
                .maxAge(Duration.ofMillis(refreshExpirationMs))
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .build();
    }

    public String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, jwtRefreshCookie);
        return cookie != null ? cookie.getValue() : null;
    }


    public String generateTokenFromUserId(String userId) {
        return Jwts.builder()
                .subject(userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key())
                .compact();
    }


    public String getUserIdFromJwtToken(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String generateTokenForUser(String username, List<String> roles) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .claim("isDemoAccount", true)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

        public boolean validateJwtToken (String authToken){
            try {
                Jwts.parser().verifyWith(key()).build().parseSignedClaims(authToken);
                return true;
            } catch (MalformedJwtException e) {
                logger.error("Invalid JWT token: {}", e.getMessage());
            } catch (ExpiredJwtException e) {
                logger.error("JWT token is expired: {}", e.getMessage());
            } catch (UnsupportedJwtException e) {
                logger.error("JWT token is unsupported: {}", e.getMessage());
            } catch (IllegalArgumentException e) {
                logger.error("JWT claims string is empty: {}", e.getMessage());
            }
            return false;
        }
    }
