package com.hackathon.odoo.controller;

import com.hackathon.odoo.dto.*;
import com.hackathon.odoo.entity.User;
import com.hackathon.odoo.service.AuthService;
import com.hackathon.odoo.exception.*;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Optional;

/**
 * AuthController - Complete REST API Controller for Authentication
 *
 * This controller provides comprehensive authentication endpoints:
 * - User registration with email verification
 * - User login and authentication
 * - Email verification handling
 * - Password reset functionality
 * - User profile management
 * - Admin endpoints for user statistics
 * - Health check and service monitoring
 *
 * Integrates perfectly with:
 * - User entity (complete data model)
 * - UserRepository (optimized data access)
 * - RegisterRequest/LoginRequest DTOs (validated input)
 * - RegisterResponse/LoginResponse DTOs (structured output)
 * - AuthResponse DTO (base response structure)
 * - AuthService (comprehensive business logic)
 * - Custom exceptions (proper error handling)
 *
 * @author Odoo Hackathon Team
 * @version 1.0
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"},
        allowCredentials = "true",
        maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    // ✅ USER REGISTRATION ENDPOINT
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(
            @Valid @RequestBody RegisterRequest request,
            BindingResult bindingResult,
            HttpServletRequest httpRequest) {

        long startTime = System.currentTimeMillis();
        System.out.println("🚀 Registration endpoint hit! Email: " + request.getEmail());

        try {
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                Map<String, String> fieldErrors = bindingResult.getFieldErrors().stream()
                        .collect(Collectors.toMap(
                                fieldError -> fieldError.getField(),
                                fieldError -> fieldError.getDefaultMessage(),
                                (existing, replacement) -> existing
                        ));

                RegisterResponse errorResponse = new RegisterResponse();
                errorResponse.setSuccess(false);
                errorResponse.setMessage("Please check the highlighted fields and try again.");

                System.err.println("❌ Registration validation failed: " + fieldErrors);

                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Sanitize input data
            request.sanitize();

            // Log registration attempt (without password)
            System.out.println("📝 Registration data validated: " + request.toString());

            // Call service to register user
            User registeredUser = authService.register(request);

            // Create success response using RegisterResponse DTO
            RegisterResponse response = RegisterResponse.fromUser(
                    "Registration successful! Please check your email for verification.",
                    registeredUser
            );

            // Add processing metadata
            long processingTime = System.currentTimeMillis() - startTime;
            System.out.println("✅ Registration successful for user: " + registeredUser.getEmail() +
                    " (processed in " + processingTime + "ms)");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (UserAlreadyExistsException e) {
            System.err.println("❌ Registration failed - Email already exists: " + request.getEmail());

            RegisterResponse errorResponse = new RegisterResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("An account with this email address already exists. Please try signing in instead.");
            errorResponse.setEmail(request.getEmail());

            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            System.err.println("❌ Registration failed: " + e.getMessage());

            RegisterResponse errorResponse = new RegisterResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Unable to create account. Please try again later.");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // ✅ USER LOGIN ENDPOINT
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(
            @Valid @RequestBody LoginRequest request,
            BindingResult bindingResult,
            HttpServletRequest httpRequest) {

        long startTime = System.currentTimeMillis();
        System.out.println("🔐 Login endpoint hit! Email: " + request.getEmail());

        try {
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                LoginResponse errorResponse = LoginResponse.error(
                        "Invalid login credentials. Please check your input.",
                        "VALIDATION_ERROR"
                );
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Sanitize input data
            request.sanitize();

            // Add device information from request
            request.setUserAgent(httpRequest.getHeader("User-Agent"));
            request.setIpAddress(getClientIpAddress(httpRequest));

            // Log login attempt (without password)
            System.out.println("🔐 Login data validated: " + request.toString());
            System.out.println("🌐 Client IP: " + request.getIpAddress());

            // Authenticate user
            User authenticatedUser = authService.authenticate(
                    request.getEmail(),
                    request.getPassword()
            );

            // Create success response using LoginResponse DTO
            LoginResponse response = LoginResponse.fromUser(
                    "Login successful! Welcome back!",
                    authenticatedUser
            );

            // Set remember me preference
            response.setRememberMe(request.isRememberMeLogin());

            // TODO: Add JWT token generation here if needed
            // String token = jwtService.generateToken(authenticatedUser, request.isRememberMeLogin());
            // response.getSession().setRefreshToken(token);

            long processingTime = System.currentTimeMillis() - startTime;
            System.out.println("✅ Login successful for user: " + authenticatedUser.getEmail() +
                    " (processed in " + processingTime + "ms)");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("❌ Login failed: " + e.getMessage());

            LoginResponse errorResponse;

            // Handle specific error cases
            if (e.getMessage().contains("verify your email")) {
                errorResponse = LoginResponse.error(e.getMessage(), "ACCOUNT_NOT_VERIFIED");
            } else if (e.getMessage().contains("deactivated")) {
                errorResponse = LoginResponse.error(e.getMessage(), "ACCOUNT_DEACTIVATED");
            } else if (e.getMessage().contains("locked")) {
                errorResponse = LoginResponse.errorWithLockout(e.getMessage(), "ACCOUNT_LOCKED", 15);
            } else {
                errorResponse = LoginResponse.error(e.getMessage(), "AUTHENTICATION_FAILED");
            }

            errorResponse.setEmail(request.getEmail());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);

        } catch (Exception e) {
            System.err.println("❌ Unexpected login error: " + e.getMessage());

            LoginResponse errorResponse = LoginResponse.error(
                    "Unable to sign in. Please try again later.",
                    "LOGIN_ERROR"
            );

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // ✅ EMAIL VERIFICATION ENDPOINT
    @GetMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(@RequestParam("token") String token) {
        try {
            boolean verified = authService.verifyEmail(token);
            if (verified) {
                return ResponseEntity.ok(AuthResponse.success("Email verified successfully!"));
            } else {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.error("VERIFICATION_FAILED", "Email verification failed"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.error("VERIFICATION_ERROR", e.getMessage()));
        }
    }


    // ✅ RESEND VERIFICATION EMAIL ENDPOINT
    @PostMapping("/resend-verification")
    public ResponseEntity<AuthResponse> resendVerificationEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("🔄 Resend verification endpoint hit! Email: " + email);

        try {
            if (email == null || email.trim().isEmpty()) {
                AuthResponse response = AuthResponse.error(
                        "Email address is required.",
                        "MISSING_EMAIL"
                );
                return ResponseEntity.badRequest().body(response);
            }

            authService.resendVerificationEmail(email.trim());

            AuthResponse response = AuthResponse.success("Verification email resent successfully! Please check your inbox.")
                    .addData("email", email.trim())
                    .addData("estimatedDelivery", "2-5 minutes");

            System.out.println("✅ Verification email resent to: " + email);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("❌ Resend verification failed: " + e.getMessage());
            AuthResponse response = AuthResponse.error(e.getMessage(), "RESEND_FAILED");
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            System.err.println("❌ Resend verification error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Unable to resend verification email. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ FORGOT PASSWORD ENDPOINT
    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("🔑 Forgot password endpoint hit! Email: " + email);

        try {
            if (email == null || email.trim().isEmpty()) {
                AuthResponse response = AuthResponse.error(
                        "Email address is required.",
                        "MISSING_EMAIL"
                );
                return ResponseEntity.badRequest().body(response);
            }

            authService.initiatePasswordReset(email.trim());

            AuthResponse response = AuthResponse.success(
                            "If an account with this email exists, you will receive password reset instructions."
                    )
                    .addData("email", email.trim())
                    .addData("checkEmail", true)
                    .addData("estimatedDelivery", "2-5 minutes");

            System.out.println("✅ Password reset initiated for: " + email);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Forgot password error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Unable to process password reset. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ USER PROFILE ENDPOINT
    @GetMapping("/profile")
    public ResponseEntity<AuthResponse> getUserProfile(@RequestParam("email") String email) {
        System.out.println("👤 Profile endpoint hit! Email: " + email);

        try {
            Optional<User> userOpt = authService.findByEmail(email);

            if (userOpt.isEmpty()) {
                AuthResponse response = AuthResponse.notFound("No account found with this email address.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            User user = userOpt.get();

            AuthResponse response = AuthResponse.success("Profile retrieved successfully.")
                    .addData("user", createSafeUserResponse(user));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Profile retrieval error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Unable to retrieve profile. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ ADMIN ENDPOINT - Get User Statistics
    @GetMapping("/admin/stats")
    public ResponseEntity<AuthResponse> getUserStatistics() {
        System.out.println("📊 Admin stats endpoint hit!");

        try {
            AuthService.UserStatistics stats = authService.getUserStatistics();

            AuthResponse response = AuthResponse.success("User statistics retrieved successfully.")
                    .addData("statistics", Map.of(
                            "totalUsers", stats.getTotalUsers(),
                            "activeUsers", stats.getActiveUsers(),
                            "verifiedUsers", stats.getVerifiedUsers(),
                            "unverifiedUsers", stats.getUnverifiedUsers(),
                            "verificationRate", calculateVerificationRate(stats)
                    ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Statistics error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Unable to retrieve statistics. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ LOGOUT ENDPOINT
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(@RequestBody(required = false) Map<String, String> request,
                                               HttpServletRequest httpRequest) {
        System.out.println("🚪 Logout endpoint hit!");

        try {
            // TODO: Implement session invalidation and token blacklisting
            // String sessionId = request != null ? request.get("sessionId") : null;
            // authService.invalidateSession(sessionId);

            AuthResponse response = AuthResponse.success("Logged out successfully.")
                    .addData("redirectUrl", "/login")
                    .addData("clearStorage", true);

            System.out.println("✅ User logged out successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Logout error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Logout failed. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ CHECK EMAIL AVAILABILITY ENDPOINT
    @GetMapping("/check-email")
    public ResponseEntity<AuthResponse> checkEmailAvailability(@RequestParam("email") String email) {
        System.out.println("📧 Check email endpoint hit! Email: " + email);

        try {
            if (email == null || email.trim().isEmpty()) {
                AuthResponse response = AuthResponse.error("Email address is required.", "MISSING_EMAIL");
                return ResponseEntity.badRequest().body(response);
            }

            boolean exists = authService.findByEmail(email.trim()).isPresent();

            AuthResponse response = AuthResponse.success("Email availability checked.")
                    .addData("email", email.trim())
                    .addData("available", !exists)
                    .addData("exists", exists);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Email check error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Unable to check email availability.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ HEALTH CHECK ENDPOINT
    @GetMapping("/health")
    public ResponseEntity<AuthResponse> healthCheck() {
        AuthResponse response = AuthResponse.success("Authentication service is healthy and operational.")
                .addData("status", "UP")
                .addData("service", "Odoo Hackathon Auth Service")
                .addData("version", "1.0.0")
                .addData("environment", getEnvironment())
                .addData("uptime", getUptime());

        return ResponseEntity.ok(response);
    }

    // ✅ SERVICE INFO ENDPOINT
    @GetMapping("/info")
    public ResponseEntity<AuthResponse> getServiceInfo() {
        AuthResponse response = AuthResponse.success("Service information retrieved.")
                .addData("serviceName", "Odoo Hackathon Authentication API")
                .addData("version", "1.0.0")
                .addData("description", "Comprehensive authentication service with email verification")
                .addData("endpoints", Map.of(
                        "registration", "/api/auth/register",
                        "login", "/api/auth/login",
                        "verification", "/api/auth/verify-email",
                        "passwordReset", "/api/auth/forgot-password",
                        "profile", "/api/auth/profile"
                ))
                .addData("features", new String[]{
                        "User Registration",
                        "Email Verification",
                        "Secure Authentication",
                        "Password Reset",
                        "Admin Statistics",
                        "Health Monitoring"
                });

        return ResponseEntity.ok(response);
    }

    // ✅ UTILITY METHODS

    /**
     * Get the real client IP address, handling proxies and load balancers
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String[] ipHeaders = {
                "X-Forwarded-For",
                "Proxy-Client-IP",
                "WL-Proxy-Client-IP",
                "HTTP_X_FORWARDED_FOR",
                "HTTP_X_FORWARDED",
                "HTTP_X_CLUSTER_CLIENT_IP",
                "HTTP_CLIENT_IP",
                "HTTP_FORWARDED_FOR",
                "HTTP_FORWARDED",
                "HTTP_VIA",
                "REMOTE_ADDR"
        };

        for (String header : ipHeaders) {
            String ipAddress = request.getHeader(header);

            if (ipAddress != null &&
                    !ipAddress.isEmpty() &&
                    !"unknown".equalsIgnoreCase(ipAddress)) {

                if (ipAddress.contains(",")) {
                    ipAddress = ipAddress.split(",")[0].trim();
                }

                return ipAddress;
            }
        }

        String remoteAddr = request.getRemoteAddr();

        if ("0:0:0:0:0:0:0:1".equals(remoteAddr)) {
            remoteAddr = "127.0.0.1";
        }

        return remoteAddr;
    }

    /**
     * Create a safe user response excluding sensitive information
     */
    private Map<String, Object> createSafeUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("fullName", user.getFullName());
        userResponse.put("email", user.getEmail());
        userResponse.put("emailVerified", user.isEmailVerified());
        userResponse.put("isProfilePublic", user.isProfilePublic());
        userResponse.put("accountEnabled", user.isEnabled());
        userResponse.put("memberSince", user.getCreatedAt());
        userResponse.put("active", user.isActive());

        return userResponse;
    }

    /**
     * Calculate verification rate percentage
     */
    private double calculateVerificationRate(AuthService.UserStatistics stats) {
        if (stats.getTotalUsers() == 0) {
            return 0.0;
        }
        return Math.round((double) stats.getVerifiedUsers() / stats.getTotalUsers() * 100.0 * 100.0) / 100.0;
    }

    /**
     * Get current environment
     */
    private String getEnvironment() {
        String env = System.getProperty("spring.profiles.active");
        return env != null ? env : "development";
    }

    /**
     * Get service uptime (simplified)
     */
    private String getUptime() {
        long uptimeMs = System.currentTimeMillis() - startTime;
        long seconds = uptimeMs / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;

        return String.format("%dh %dm %ds", hours, minutes % 60, seconds % 60);
    }

    // Service start time for uptime calculation
    private static final long startTime = System.currentTimeMillis();
}
