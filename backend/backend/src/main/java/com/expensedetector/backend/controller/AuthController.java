    package com.expensedetector.backend.controller;

    import com.expensedetector.backend.model.entity.ERole;
    import com.expensedetector.backend.model.entity.Role;
    import com.expensedetector.backend.model.entity.Users;
    import com.expensedetector.backend.payload.request.LoginRequest;
    import com.expensedetector.backend.payload.request.SignupRequest;
    import com.expensedetector.backend.payload.response.JwtResponse;
    import com.expensedetector.backend.payload.response.MessageResponse;
    import com.expensedetector.backend.repository.RoleRepository;
    import com.expensedetector.backend.repository.UserRepository;
    import com.expensedetector.backend.security.jwt.JwtUtils;
    import com.expensedetector.backend.security.service.UserDetailsImpl;
    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.validation.Valid;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.ResponseCookie;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.web.bind.annotation.*;

    import java.util.UUID;

    @RestController
    @RequestMapping("/api/auth")
    public class AuthController {
        @Autowired
        AuthenticationManager authenticationManager;

        @Autowired
        UserRepository userRepository;

        @Autowired
        RoleRepository roleRepository;

        @Autowired
        PasswordEncoder encoder;

        @Autowired
        JwtUtils jwtUtils;

        @PostMapping("/signin")
        public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

            String role = userDetails.getAuthorities().stream().findFirst().map(item -> item.getAuthority()).orElse(null);


            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(new JwtResponse(
                            userDetails.getId(),
                            userDetails.getName(),
                            userDetails.getEmail(),
                            role
                    ));
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
                    user.getRole().getName().name()
            ));
        }

        @PostMapping("/signup")
        public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
            if(userRepository.existsByEmail(signupRequest.getEmail())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Email already in use!"));
            }

            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role not found."));

            // Create new user
            Users user = new Users();
            user.setName(signupRequest.getName());
            user.setEmail(signupRequest.getEmail());
            user.setPassword_hash(encoder.encode(signupRequest.getPassword()));
            user.setDefault_bank(signupRequest.getDefaultBank());
            user.setRole(userRole);


            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        }

        @PostMapping("/signout")
        public ResponseEntity<?> logoutUser() {
            ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new MessageResponse("You've been signed out!"));
        }
    }
