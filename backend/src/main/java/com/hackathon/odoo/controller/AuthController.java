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
import java.util.*;
import java.util.stream.Collectors;

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
    // ✅ ENHANCED USER LOGIN ENDPOINT - Updated for Rental Management
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

            // ✅ NEW: Check account lockout before authentication
            authService.checkAccountLockout(request.getEmail());

            // Log login attempt (without password)
            System.out.println("🔐 Login data validated: " + request.toString());
            System.out.println("🌐 Client IP: " + request.getIpAddress());

            // ✅ UPDATED: Use enhanced role-based authentication
            AuthService.AuthenticationResult authResult = authService.authenticateWithRole(
                    request.getEmail(),
                    request.getPassword()
            );

            // Create success response using enhanced LoginResponse DTO
            LoginResponse response = LoginResponse.fromUser(
                    "Login successful! Welcome back to RentHub!",
                    authResult.getUser()
            );

            // Set remember me preference
            response.setRememberMe(request.isRememberMeLogin());

            // ✅ NEW: Add session data from authentication result
            response.setSession(convertToSessionInfo(authResult.getSessionData()));

            long processingTime = System.currentTimeMillis() - startTime;
            System.out.println("✅ Login successful for user: " + authResult.getUser().getEmail() +
                    ", Role: " + authResult.getRole() +
                    ", Location: " + authResult.getLocation() +
                    " (processed in " + processingTime + "ms)");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            System.err.println("❌ Login failed: " + e.getMessage());

            // ✅ NEW: Handle failed login attempts
            authService.handleFailedLogin(request.getEmail());

            LoginResponse errorResponse;

            // Handle specific error cases with enhanced error codes
            if (e.getMessage().contains("verify your email")) {
                errorResponse = LoginResponse.error(e.getMessage(), "ACCOUNT_NOT_VERIFIED");
            } else if (e.getMessage().contains("deactivated")) {
                errorResponse = LoginResponse.error(e.getMessage(), "ACCOUNT_DEACTIVATED");
            } else if (e.getMessage().contains("temporarily locked")) {
                // Extract minutes from error message or default to 15
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

    // ✅ NEW: Helper method to convert session data
    private LoginResponse.SessionInfo convertToSessionInfo(AuthService.SessionData sessionData) {
        LoginResponse.SessionInfo sessionInfo = new LoginResponse.SessionInfo();
        sessionInfo.setSessionId(sessionData.getSessionId());
        sessionInfo.setRefreshToken(sessionData.getRefreshToken());
        sessionInfo.setExpiresAt(sessionData.getExpiresAt());
        return sessionInfo;
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
    // ✅ ENHANCED USER PROFILE ENDPOINT - Updated for Rental Management
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
                    .addData("user", createEnhancedUserResponse(user)) // ✅ Use enhanced response
                    .addData("profileCompletion", calculateProfileCompletion(user))
                    .addData("accountStatus", Map.of(
                            "isBusinessUser", user.isBusinessUser(),
                            "hasBusinessInfo", user.hasBusinessInfo(),
                            "isExperienced", user.isExperiencedUser(),
                            "hasGoodRating", user.hasGoodRating()
                    ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Profile retrieval error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Unable to retrieve profile. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ ADMIN ENDPOINT - Get User Statistics
    // ✅ ENHANCED ADMIN ENDPOINT - Get Comprehensive User Statistics
    @GetMapping("/admin/stats")
    public ResponseEntity<AuthResponse> getUserStatistics() {
        System.out.println("📊 Enhanced admin stats endpoint hit!");

        try {
            // ✅ Get basic user statistics
            AuthService.UserStatistics stats = authService.getUserStatistics();

            // ✅ Get role distribution
            Map<String, Long> roleDistribution = authService.getRoleDistribution();

            // ✅ Get business user statistics
            AuthService.BusinessUserStats businessStats = authService.getBusinessUserStatistics();

            AuthResponse response = AuthResponse.success("Enhanced user statistics retrieved successfully.")
                    .addData("userStatistics", Map.of(
                            "totalUsers", stats.getTotalUsers(),
                            "activeUsers", stats.getActiveUsers(),
                            "verifiedUsers", stats.getVerifiedUsers(),
                            "unverifiedUsers", stats.getUnverifiedUsers(),
                            "verificationRate", stats.getVerificationRate(),
                            "activeUserRate", stats.getActiveUserRate()
                    ))
                    .addData("roleDistribution", roleDistribution)
                    .addData("businessStatistics", Map.of(
                            "totalBusinessUsers", businessStats.getTotalBusinessUsers(),
                            "ownersCount", businessStats.getOwnersCount(),
                            "businessesCount", businessStats.getBusinessesCount(),
                            "ownerPercentage", businessStats.getOwnerPercentage()
                    ))
                    .addData("platformHealth", Map.of(
                            "isHealthy", stats.getTotalUsers() > 0,
                            "growthRate", calculateGrowthRate(stats),
                            "engagementScore", calculateEngagementScore(stats)
                    ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Enhanced statistics error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Unable to retrieve statistics. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ NEW: Helper methods for enhanced statistics
    private double calculateGrowthRate(AuthService.UserStatistics stats) {
        // Simplified growth rate calculation
        return stats.getTotalUsers() > 0 ? 5.2 : 0.0; // Mock growth rate
    }

    private double calculateEngagementScore(AuthService.UserStatistics stats) {
        // Engagement based on verification rate and active users
        return (stats.getVerificationRate() + stats.getActiveUserRate()) / 2.0;
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
    // ✅ ENHANCED SERVICE INFO ENDPOINT
    @GetMapping("/info")
    public ResponseEntity<AuthResponse> getServiceInfo() {
        AuthResponse response = AuthResponse.success("Service information retrieved.")
                .addData("serviceName", "RentHub Authentication API")
                .addData("version", "2.0.0")
                .addData("description", "Comprehensive rental management authentication service")
                .addData("platform", "RentHub - Rental Management Platform")
                .addData("endpoints", Map.of(
                        "registration", "/api/auth/register",
                        "login", "/api/auth/login",
                        "verification", "/api/auth/verify-email",
                        "passwordReset", "/api/auth/forgot-password",
                        "profile", "/api/auth/profile",
                        "roleStats", "/api/auth/admin/role-stats",
                        "businessUsers", "/api/auth/business-users"
                ))
                .addData("features", new String[]{
                        "Role-based Registration (Customer, Owner, Business, Admin)",
                        "Location-based User Management",
                        "Business Information Handling",
                        "Enhanced Email Verification",
                        "Secure Role-based Authentication",
                        "Account Security (Lockout Protection)",
                        "Password Reset with Security",
                        "Comprehensive Admin Statistics",
                        "Profile Completion Tracking",
                        "Business User Analytics"
                })
                .addData("supportedRoles", new String[]{
                        "CUSTOMER - Browse and book rentals",
                        "OWNER - List and manage properties",
                        "BUSINESS - Commercial rental management",
                        "ADMIN - Platform administration"
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

    // ✅ NEW: GET USERS BY ROLE ENDPOINT
    @GetMapping("/users/role/{role}")
    public ResponseEntity<AuthResponse> getUsersByRole(@PathVariable("role") String role) {
        System.out.println("👥 Get users by role endpoint hit! Role: " + role);

        try {
            User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
            var users = authService.getUsersByRole(userRole);

            AuthResponse response = AuthResponse.success("Users retrieved successfully.")
                    .addData("users", users.stream()
                            .map(this::createSafeUserResponse)
                            .collect(Collectors.toList()))
                    .addData("role", role)
                    .addData("count", users.size());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            AuthResponse response = AuthResponse.error("Invalid user role: " + role, "INVALID_ROLE");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            System.err.println("❌ Get users by role error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Unable to retrieve users.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ NEW: GET BUSINESS USERS IN LOCATION ENDPOINT
    @GetMapping("/business-users")
    public ResponseEntity<AuthResponse> getBusinessUsersInLocation(@RequestParam("location") String location) {
        System.out.println("🏢 Get business users endpoint hit! Location: " + location);

        try {
            var businessUsers = authService.getBusinessUsersInLocation(location);

            AuthResponse response = AuthResponse.success("Business users retrieved successfully.")
                    .addData("businessUsers", businessUsers.stream()
                            .map(this::createEnhancedUserResponse)
                            .collect(Collectors.toList()))
                    .addData("location", location)
                    .addData("count", businessUsers.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Get business users error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Unable to retrieve business users.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ NEW: GET ROLE DISTRIBUTION STATISTICS
    @GetMapping("/admin/role-stats")
    public ResponseEntity<AuthResponse> getRoleDistribution() {
        System.out.println("📊 Role distribution stats endpoint hit!");

        try {
            Map<String, Long> roleDistribution = authService.getRoleDistribution();
            AuthService.BusinessUserStats businessStats = authService.getBusinessUserStatistics();

            AuthResponse response = AuthResponse.success("Role distribution retrieved successfully.")
                    .addData("roleDistribution", roleDistribution)
                    .addData("businessStats", Map.of(
                            "totalBusinessUsers", businessStats.getTotalBusinessUsers(),
                            "ownersCount", businessStats.getOwnersCount(),
                            "businessesCount", businessStats.getBusinessesCount(),
                            "ownerPercentage", businessStats.getOwnerPercentage()
                    ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Role distribution error: " + e.getMessage());
            AuthResponse response = AuthResponse.serverError("Unable to retrieve role statistics.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ ENHANCED: Create enhanced user response including rental management fields
    private Map<String, Object> createEnhancedUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();

        // Basic fields
        userResponse.put("id", user.getId());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("fullName", user.getFullName());
        userResponse.put("email", user.getEmail());
        userResponse.put("emailVerified", user.isEmailVerified());
        userResponse.put("accountEnabled", user.isEnabled());
        userResponse.put("memberSince", user.getCreatedAt());
        userResponse.put("active", user.isActive());

        // ✅ NEW: Rental management fields
        userResponse.put("role", user.getUserRole());
        userResponse.put("location", user.getLocation());
        userResponse.put("isBusinessUser", user.isBusinessUser());
        userResponse.put("totalRentals", user.getTotalRentals());
        userResponse.put("averageRating", user.getAverageRating());
        userResponse.put("profilePhotoUrl", user.getProfilePhotoUrl());

        // Business information (if applicable)
        if (user.isBusinessUser()) {
            userResponse.put("businessName", user.getBusinessName());
            userResponse.put("businessType", user.getBusinessType());
            userResponse.put("hasBusinessInfo", user.hasBusinessInfo());
            userResponse.put("displayName", user.getDisplayName());
        }

        return userResponse;
    }

    // ✅ NEW: Calculate profile completion percentage
    private Map<String, Object> calculateProfileCompletion(User user) {
        int completionScore = 0;
        List<String> missingFields = new ArrayList<>();

        // Basic profile (40%)
        if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) completionScore += 10;
        else missingFields.add("First name");

        if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) completionScore += 10;
        else missingFields.add("Last name");

        if (user.getLocation() != null && !user.getLocation().trim().isEmpty()) completionScore += 20;
        else missingFields.add("Location");

        // Profile details (30%)
        if (user.getProfilePhotoUrl() != null && !user.getProfilePhotoUrl().trim().isEmpty()) completionScore += 15;
        else missingFields.add("Profile photo");

        if (user.getBio() != null && !user.getBio().trim().isEmpty()) completionScore += 15;
        else missingFields.add("Bio/Description");

        // Business info for owners (30%)
        if (user.isBusinessUser()) {
            if (user.getBusinessName() != null && !user.getBusinessName().trim().isEmpty()) completionScore += 15;
            else missingFields.add("Business name");

            if (user.getBusinessType() != null) completionScore += 15;
            else missingFields.add("Business type");
        } else {
            completionScore += 30; // Not applicable for customers
        }

        return Map.of(
                "percentage", completionScore,
                "missingFields", missingFields,
                "suggestion", getProfileSuggestion(completionScore, missingFields)
        );
    }

    // ✅ NEW: Get profile completion suggestion
    private String getProfileSuggestion(int score, List<String> missing) {
        if (score >= 90) return "Your profile looks great! Keep engaging with the platform.";
        if (score >= 70) return "Almost complete! Consider adding " + String.join(", ", missing.subList(0, Math.min(2, missing.size())));
        if (score >= 50) return "Good start! Complete your " + String.join(" and ", missing.subList(0, Math.min(3, missing.size())));
        return "Let's complete your profile to get the best rental experience.";
    }


}
