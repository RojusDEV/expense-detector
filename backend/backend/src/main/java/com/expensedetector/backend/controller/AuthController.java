    package com.expensedetector.backend.controller;

    import com.expensedetector.backend.exception.InvalidTokenException;
    import com.expensedetector.backend.model.entity.ERole;
    import com.expensedetector.backend.model.entity.Role;
    import com.expensedetector.backend.model.entity.Users;
    import com.expensedetector.backend.payload.request.LoginRequest;
    import com.expensedetector.backend.payload.request.SignupRequest;
    import com.expensedetector.backend.payload.response.JwtResponse;
    import com.expensedetector.backend.payload.response.MessageResponse;
    import com.expensedetector.backend.repository.RefreshTokenRepository;
    import com.expensedetector.backend.repository.RoleRepository;
    import com.expensedetector.backend.repository.UserRepository;
    import com.expensedetector.backend.security.jwt.JwtUtils;
    import com.expensedetector.backend.security.service.UserDetailsImpl;
    import com.expensedetector.backend.service.RefreshTokenService;
    import com.expensedetector.backend.service.auth.LogoutService;
    import jakarta.servlet.http.Cookie;
    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.servlet.http.HttpServletResponse;
    import jakarta.validation.Valid;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseCookie;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.UUID;

    @RestController
    @RequestMapping("/api/auth")
    public class AuthController {
        private final AuthenticationManager authenticationManager;
        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtils jwtUtils;
        private final RefreshTokenRepository refreshTokenRepository;
        private final RefreshTokenService refreshTokenService;
        private final LogoutService logoutService;
        public AuthController(AuthenticationManager authenticationManager,
                              UserRepository userRepository,
                              RoleRepository roleRepository,
                              PasswordEncoder passwordEncoder,
                              JwtUtils jwtUtils,
                              RefreshTokenRepository refreshTokenRepository,
                              RefreshTokenService refreshTokenService,
                              LogoutService logoutService) {
            this.authenticationManager = authenticationManager;
            this.userRepository = userRepository;
            this.roleRepository = roleRepository;
            this.passwordEncoder = passwordEncoder;
            this.jwtUtils = jwtUtils;
            this.refreshTokenRepository = refreshTokenRepository;
            this.refreshTokenService = refreshTokenService;
            this.logoutService = logoutService;
        }

        @PostMapping("/demo-guest")
        public ResponseEntity<?> genereateGuestToken() {
            String token = jwtUtils.generateTokenForUser("demo_user", List.of("DEMO"));
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, token).build();
        }

        @PostMapping("/signin")
        public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(item -> item.getAuthority())
                    .orElse(null);

            ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
            String refreshToken = refreshTokenService.generateRefreshToken(userDetails.getId());
            ResponseCookie refreshCookie = jwtUtils.generateRefreshCookie(refreshToken);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                    .body(new JwtResponse(userDetails.getId(), userDetails.getName(), userDetails.getEmail(), role, null));
        }

        @GetMapping("/me")
        public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
            String jwt = jwtUtils.getJwtFromCookies(request);
            if (jwt == null || !jwtUtils.validateJwtToken(jwt)) {
                return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
            }
            String userId = jwtUtils.getUserIdFromJwtToken(jwt);
            Users user = userRepository.findById(UUID.fromString(userId))
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(new JwtResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().getName().name(),
                    null
            ));
        }


        @Value("${app.jwtCookieName}")
        private String jwtCookieName;

        @PostMapping("/demo-login")
        public ResponseEntity<?> demoLoginUser() {

            String token = jwtUtils.generateTokenFromUserId("516a0924-9a92-4168-ae15-3132aecfd1e3");

            if(token == null || token.isBlank()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Demo user was not found or doesn't exist"));
            }

            ResponseCookie responseCookie = ResponseCookie.from(jwtCookieName, token)
                    .path("/api")
                    .maxAge(600)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("Strict")
                    .build();


            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(new MessageResponse("Demo user login successful"));
        }

        @PostMapping("/signup")
        public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
            if (userRepository.existsByEmail(signupRequest.getEmail())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Email already in use!"));
            }

            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found."));

            Users user = new Users();
            user.setName(signupRequest.getName());
            user.setEmail(signupRequest.getEmail());
            user.setPassword_hash(passwordEncoder.encode(signupRequest.getPassword()));
            user.setDefault_bank(signupRequest.getDefaultBank());
            user.setRole(userRole);
            userRepository.save(user);

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(signupRequest.getEmail(), signupRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(item -> item.getAuthority())
                    .orElse(null);

            ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
            String refreshToken = refreshTokenService.generateRefreshToken(userDetails.getId());
            ResponseCookie refreshCookie = jwtUtils.generateRefreshCookie(refreshToken);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                    .body(new JwtResponse(userDetails.getId(), userDetails.getName(), userDetails.getEmail(), role, null));
        }

        @PostMapping("/refresh")
        public ResponseEntity<MessageResponse> refreshToken(HttpServletRequest request) {
            String requestToken = jwtUtils.getRefreshTokenFromCookies(request); // new method, mirrors getJwtFromCookies
            if (requestToken == null) {
                return ResponseEntity.status(401).body(new MessageResponse("No refresh token."));
            }
            return refreshTokenRepository.findByToken(requestToken)
                    .map(token -> {
                        try {
                            UUID userId = refreshTokenService.validateRefreshTokenAndGetUserId(token.getToken());
                            Users user = userRepository.findById(userId)
                                    .orElseThrow(() -> new RuntimeException("User not found"));
                            UserDetailsImpl userDetails = UserDetailsImpl.build(user);
                            ResponseCookie newJwtCookie = jwtUtils.generateJwtCookie(userDetails);
                            return ResponseEntity.ok()
                                    .header(HttpHeaders.SET_COOKIE, newJwtCookie.toString())
                                    .body(new MessageResponse("Refreshed"));
                        } catch (InvalidTokenException ex) {
                            refreshTokenRepository.delete(token);
                            return ResponseEntity.status(401).body(new MessageResponse("Refresh token expired. Please login again."));
                        }
                    })
                    .orElse(ResponseEntity.status(401).body(new MessageResponse("Invalid refresh token.")));
        }

        @PostMapping("/signout")
        public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
            return logoutService.logout(request, response);
        }
    }
