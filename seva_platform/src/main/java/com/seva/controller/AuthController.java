package com.seva.controller;

import com.seva.entity.Users;
import com.seva.security.JwtUtil;
import com.seva.service.AuthService;
import com.seva.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestParam String phoneNumber) {
        log.info("Sending OTP to number: {}", phoneNumber);
        String otp = otpService.generateOtp(phoneNumber);
        // SMS simulation for development
        log.info("SIMULATION: OTP for {} is: {}", phoneNumber, otp);
        Map<String, String> response = new HashMap<>();
        response.put("message", "OTP sent successfully");
        response.put("otp", otp); // Include OTP in response for development
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestParam String phoneNumber, @RequestParam String otp) {
        log.info("Verifying OTP for number: {}", phoneNumber);
        if (otpService.validateOtp(phoneNumber, otp)) {
            Optional<Users> userOpt = authService.findByPhoneNumber(phoneNumber);

            // Get user role, default to USER if no user exists yet
            String role = userOpt.map(u -> u.getRole().name()).orElse("USER");
            String token = jwtUtil.generateToken(phoneNumber, role);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("isNewUser", userOpt.isEmpty());

            log.info("OTP verified successfully for number: {}", phoneNumber);
            return ResponseEntity.ok(response);
        } else {
            log.warn("Invalid OTP for number: {}", phoneNumber);
            return ResponseEntity.status(401).body(Map.of("message", "Invalid OTP"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Users> register(@jakarta.validation.Valid @RequestBody Users user,
            java.security.Principal principal) {
        if (principal == null) {
            log.warn("Registration attempt without principal");
            return ResponseEntity.status(401).build();
        }
        // Ensure the phone number matches the token
        user.setPhoneNumber(principal.getName());
        log.info("Registering user: {}", user.getPhoneNumber());
        return ResponseEntity.ok(authService.registerOrUpdateUser(user));
    }

    @GetMapping("/me")
    public ResponseEntity<Users> getMe(java.security.Principal principal) {
        if (principal == null) {
            log.warn("Principal is NULL in /me");
            return ResponseEntity.status(401).build();
        }
        String phoneNumber = principal.getName();
        log.debug("Principal Name in /me: '{}'", phoneNumber);

        return authService.findByPhoneNumber(phoneNumber)
                .map(user -> {
                    log.debug("User found for: {}", phoneNumber);
                    return ResponseEntity.ok(user);
                })
                .orElseGet(() -> {
                    log.warn("User NOT found for: {}", phoneNumber);
                    return ResponseEntity.notFound().build();
                });
    }
}
