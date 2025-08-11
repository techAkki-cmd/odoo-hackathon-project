package com.hackathon.odoo.service;

import com.hackathon.odoo.dto.RegisterRequest;
import com.hackathon.odoo.entity.User;
import com.hackathon.odoo.repository.UserRepository;
import com.hackathon.odoo.exception.UserAlreadyExistsException;
import com.hackathon.odoo.exception.InvalidTokenException;
import com.hackathon.odoo.exception.TokenExpiredException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

/**
 * AuthService - Complete Authentication & User Management Service
 *
 * This service handles all authentication-related business logic:
 * - User registration with comprehensive validation
 * - Email verification with secure token management
 * - User authentication with security checks
 * - Password reset functionality
 * - Account management and user statistics
 * - Perfect integration with all system components
 *
 * Integrates perfectly with:
 * - User entity (complete data model)
 * - UserRepository (optimized data access)
 * - EmailService (professional email templates)
 * - RegisterRequest/LoginRequest DTOs (validated input)
 * - Custom exceptions (proper error handling)
 * - AuthController (REST API layer)
 *
 * @author Odoo Hackathon Team
 * @version 2.0 - Updated for complete system integration
 */
@Service
@Transactional
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService; // ✅ Updated to use EmailService instead of JavaMailSender

    // Configuration from application.properties
    @Value("${app.verification.token.expiration:24}")
    private int tokenExpirationHours;

    @Value("${app.password.reset.expiration:2}")
    private int passwordResetExpirationHours;

    // ✅ USER REGISTRATION - Enhanced with EmailService integration
    // ✅ ENHANCED USER REGISTRATION - Updated for Rental Management Platform
    public User register(RegisterRequest request) {
        System.out.println("🚀 Registration service called for email: " + request.getEmail());

        // 1. Validate that email doesn't already exist (case-insensitive)
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            System.err.println("❌ Registration failed - Email already exists: " + request.getEmail());
            throw new UserAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        // 2. Create new user with ALL required fields including rental management fields
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail().toLowerCase()); // Ensure lowercase
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ NEW: Set rental management specific fields
        user.setUserRole(request.getUserRole() != null ? request.getUserRole() : User.UserRole.CUSTOMER);
        user.setLocation(request.getLocation()); // Required field from frontend

        // ✅ NEW: Set business information (for property owners)
        if (user.isBusinessUser() && request.getBusinessName() != null) {
            user.setBusinessName(request.getBusinessName());
            user.setBusinessLicense(request.getBusinessLicense());
            user.setBusinessType(request.getBusinessType());
        }

        // 3. Set boolean fields explicitly to prevent database errors
        user.setEnabled(false);           // Account disabled until email verification
        user.setEmailVerified(false);     // Email not verified yet
        user.setActive(true);            // Account is active (not deleted)

        // 4. Generate and set verification token
        String verificationToken = generateSecureToken();
        user.setVerificationToken(verificationToken);
        user.setTokenExpiration(LocalDateTime.now().plusHours(tokenExpirationHours));

        try {
            // 5. Save user to database
            User savedUser = userRepository.save(user);
            System.out.println("✅ User saved successfully with ID: " + savedUser.getId() +
                    ", Role: " + savedUser.getUserRole() +
                    ", Location: " + savedUser.getLocation());

            // 6. Send role-specific verification email using EmailService
            emailService.sendVerificationEmail(savedUser);

            return savedUser;

        } catch (Exception e) {
            System.err.println("❌ Registration error: " + e.getMessage());
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }


    // ✅ USER AUTHENTICATION - Enhanced with comprehensive security checks
    public User authenticate(String email, String password) {
        System.out.println("🔐 Authentication attempt for email: " + email);

        // Find user by email (case insensitive)
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isEmpty()) {
            System.err.println("❌ Authentication failed - User not found: " + email);
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOpt.get();

        // Check if account is active
        if (!user.isActive()) {
            System.err.println("❌ Authentication failed - Account deactivated: " + email);
            throw new RuntimeException("Account has been deactivated. Please contact support.");
        }

        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.err.println("❌ Authentication failed - Invalid password: " + email);
            throw new RuntimeException("Invalid email or password");
        }

        // Check if email is verified
        if (!user.isEmailVerified()) {
            System.err.println("❌ Authentication failed - Email not verified: " + email);
            throw new RuntimeException("Please verify your email address before signing in. Check your inbox for the verification link.");
        }

        // Check if account is enabled
        if (!user.isEnabled()) {
            System.err.println("❌ Authentication failed - Account not enabled: " + email);
            throw new RuntimeException("Account is not activated. Please complete email verification first.");
        }

        System.out.println("✅ Authentication successful for user ID: " + user.getId());
        return user;
    }

    // ✅ ENHANCED AUTHENTICATION WITH ROLE-BASED RESPONSE
    public AuthenticationResult authenticateWithRole(String email, String password) {
        System.out.println("🔐 Role-based authentication attempt for email: " + email);

        // Use existing authenticate method for validation
        User user = authenticate(email, password);

        // Update last login time
        user.updateLastLogin();
        user.resetLoginAttempts(); // Reset failed attempts on successful login
        userRepository.save(user);

        // Create authentication result with role information
        return new AuthenticationResult(
                user,
                user.getUserRole(),
                user.getLocation(),
                user.isBusinessUser(),
                user.hasBusinessInfo(),
                generateSessionData(user)
        );
    }

    // Helper method for session data
    private SessionData generateSessionData(User user) {
        return new SessionData(
                generateSecureToken(), // Session ID
                generateSecureToken(), // Refresh token
                LocalDateTime.now().plusHours(24) // 24 hour session
        );
    }

    // ✅ SECURITY: Handle failed login attempts
    public void handleFailedLogin(String email) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.incrementLoginAttempts();

            // Lock account after 5 failed attempts
            if (user.getLoginAttempts() >= 5) {
                user.lockAccount(15); // Lock for 15 minutes
                System.out.println("🔒 Account locked due to failed attempts: " + email);
            }

            userRepository.save(user);
        }
    }

    // ✅ CHECK: Account lockout status
    public void checkAccountLockout(String email) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (user.isAccountLocked()) {
                long minutesRemaining = java.time.Duration.between(
                        LocalDateTime.now(),
                        user.getLockoutTime()
                ).toMinutes();

                throw new RuntimeException(
                        "Account temporarily locked. Try again in " + minutesRemaining + " minutes."
                );
            }
        }
    }



    // ✅ EMAIL VERIFICATION - Enhanced with proper exception handling
    public boolean verifyEmail(String token) {
        logger.info("📧 Email verification attempt with token: {}...",
                token.substring(0, Math.min(8, token.length())));

        if (token == null || token.trim().isEmpty()) {
            logger.error("❌ Verification failed - Token is null or empty");
            throw new InvalidTokenException("Verification token is required");
        }

        // ✅ FIRST: Find user by token
        Optional<User> userByToken = userRepository.findByVerificationToken(token);
        if (userByToken.isEmpty()) {
            logger.error("❌ Verification failed - Token not found in database: {}", token);
            throw new InvalidTokenException("Invalid verification token. Token not found.");
        }

        User user = userByToken.get();
        logger.info("✅ Token found for user: {}", user.getEmail());

        // ✅ THEN: Check if already verified (AFTER getting user)
        if (user.isEmailVerified()) {
            logger.warn("⚠️ User already verified: {}", user.getEmail());
            return true; // Return success for already verified users
        }

        // ✅ Check if token is expired
        if (user.getTokenExpiration() != null && LocalDateTime.now().isAfter(user.getTokenExpiration())) {
            logger.error("❌ Verification failed - Token expired for user: {} (expired at: {}, current time: {})",
                    user.getEmail(), user.getTokenExpiration(), LocalDateTime.now());
            throw new TokenExpiredException("Verification token has expired. Please request a new verification email.");
        }

        try {
            // Update user verification status
            user.setEmailVerified(true);
            user.setEnabled(true);
            user.setVerificationToken(null); // Clear the token
            user.setTokenExpiration(null);   // Clear expiration

            userRepository.save(user);

            logger.info("✅ Email verified successfully for user: {}", user.getEmail());

            // Send welcome email
            emailService.sendWelcomeEmail(user);

            return true;

        } catch (Exception e) {
            logger.error("❌ Error updating user verification status: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to complete email verification", e);
        }
    }


    // ✅ RESEND VERIFICATION EMAIL - Enhanced with comprehensive validation
    public void resendVerificationEmail(String email) {
        System.out.println("🔄 Resending verification email to: " + email);

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isEmpty()) {
            System.err.println("❌ Resend failed - User not found: " + email);
            throw new RuntimeException("No account found with this email address");
        }

        User user = userOpt.get();

        // Check if account is active
        if (!user.isActive()) {
            System.err.println("❌ Resend failed - Account inactive: " + email);
            throw new RuntimeException("Account has been deactivated. Please contact support.");
        }

        // Check if email is already verified
        if (user.isEmailVerified()) {
            System.err.println("❌ Resend failed - Email already verified: " + email);
            throw new RuntimeException("Email address is already verified. You can sign in to your account.");
        }

        try {
            // Generate new verification token
            String newToken = generateSecureToken();
            user.setVerificationToken(newToken);
            user.setTokenExpiration(LocalDateTime.now().plusHours(tokenExpirationHours));

            userRepository.save(user);

            // Send new verification email using EmailService
            emailService.sendVerificationEmail(user);

            System.out.println("✅ Verification email resent successfully to: " + email);

        } catch (Exception e) {
            System.err.println("❌ Error resending verification email: " + e.getMessage());
            throw new RuntimeException("Failed to resend verification email", e);
        }
    }

    // ✅ PASSWORD RESET INITIATION - Enhanced with security measures
    public void initiatePasswordReset(String email) {
        System.out.println("🔑 Password reset initiated for email: " + email);

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isEmpty()) {
            // Don't reveal if email exists or not for security (but log it)
            System.err.println("⚠️ Password reset requested for non-existent email: " + email);
            return; // Return success regardless to prevent email enumeration
        }

        User user = userOpt.get();

        // Check if account is active
        if (!user.isActive()) {
            System.err.println("⚠️ Password reset requested for inactive account: " + email);
            return; // Return success regardless for security
        }

        try {
            // Generate password reset token (shorter expiration for security)
            String resetToken = generateSecureToken();
            user.setVerificationToken(resetToken);
            user.setTokenExpiration(LocalDateTime.now().plusHours(passwordResetExpirationHours));

            userRepository.save(user);

            // Send password reset email using EmailService
            emailService.sendPasswordResetEmail(user);

            System.out.println("✅ Password reset email sent to: " + email);

        } catch (Exception e) {
            System.err.println("❌ Error sending password reset email: " + e.getMessage());
            // Don't throw exception to prevent revealing email existence
        }
    }

    // ✅ PASSWORD RESET COMPLETION - New method for completing password reset
    public boolean resetPassword(String token, String newPassword) {
        System.out.println("🔑 Password reset completion attempt with token: " + token.substring(0, Math.min(8, token.length())) + "...");

        if (token == null || token.trim().isEmpty()) {
            throw new InvalidTokenException("Password reset token is required");
        }

        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long");
        }

        // Find user by valid reset token
        Optional<User> userOpt = userRepository.findByValidVerificationToken(token, LocalDateTime.now());

        if (userOpt.isEmpty()) {
            // Check if token exists but is expired
            Optional<User> expiredUser = userRepository.findByVerificationToken(token);
            if (expiredUser.isPresent()) {
                System.err.println("❌ Password reset failed - Token expired for user: " + expiredUser.get().getEmail());
                throw new TokenExpiredException(
                        "Password reset token has expired. Please request a new password reset.",
                        "password_reset",
                        expiredUser.get().getTokenExpiration()
                );
            } else {
                System.err.println("❌ Password reset failed - Invalid token");
                throw new InvalidTokenException("Invalid password reset token");
            }
        }

        User user = userOpt.get();

        try {
            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));

            // Clear reset token
            userRepository.clearVerificationToken(user.getId());

            // Save updated user
            userRepository.save(user);

            System.out.println("✅ Password reset successful for user: " + user.getEmail());
            return true;

        } catch (Exception e) {
            System.err.println("❌ Error resetting password: " + e.getMessage());
            throw new RuntimeException("Failed to reset password", e);
        }
    }

    // ✅ USER LOOKUP METHODS - Enhanced for AuthController integration

    /**
     * Find user by email (for admin and profile purposes)
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    /**
     * Find user by ID
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Get all active users
     */
    public List<User> getAllActiveUsers() {
        return userRepository.findByActiveTrue();
    }

    /**
     * Get all users with pagination support
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ USER STATISTICS - Enhanced for admin dashboard
    public UserStatistics getUserStatistics() {
        try {
            Object[] stats = userRepository.getUserStatistics();

            if (stats != null && stats.length >= 4) {
                return new UserStatistics(
                        ((Number) stats[0]).longValue(),  // total users
                        ((Number) stats[1]).longValue(),  // active users
                        ((Number) stats[2]).longValue(),  // verified users
                        ((Number) stats[3]).longValue()   // unverified users
                );
            }

            return new UserStatistics(0L, 0L, 0L, 0L);

        } catch (Exception e) {
            System.err.println("❌ Error retrieving user statistics: " + e.getMessage());
            return new UserStatistics(0L, 0L, 0L, 0L);
        }
    }

    // ✅ MAINTENANCE METHODS - Enhanced for system health

    /**
     * Clean up expired verification tokens (scheduled job)
     */
    @Transactional
    public int cleanupExpiredTokens() {
        try {
            int cleaned = userRepository.cleanupExpiredTokens(LocalDateTime.now());
            System.out.println("🧹 Cleaned up " + cleaned + " expired verification tokens");
            return cleaned;
        } catch (Exception e) {
            System.err.println("❌ Error cleaning up expired tokens: " + e.getMessage());
            return 0;
        }
    }

    /**
     * Get users with expired tokens for cleanup
     */
    public List<User> getUsersWithExpiredTokens() {
        return userRepository.findUsersWithExpiredTokens(LocalDateTime.now());
    }

    /**
     * Deactivate user account (soft delete)
     */
    public void deactivateUser(String email) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setActive(false);
            user.setEnabled(false);
            userRepository.save(user);
            System.out.println("🚫 User deactivated: " + email);
        } else {
            System.err.println("❌ Cannot deactivate - User not found: " + email);
            throw new RuntimeException("User not found: " + email);
        }
    }

    // ✅ RENTAL MANAGEMENT: Get users by role
    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findByUserRole(role);
    }

    // ✅ RENTAL MANAGEMENT: Get business users in location
    public List<User> getBusinessUsersInLocation(String location) {
        return userRepository.findBusinessUsersInLocation(location);
    }

    // ✅ RENTAL MANAGEMENT: Get customers in location
    public List<User> getCustomersInLocation(String location) {
        return userRepository.findCustomersInLocation(location);
    }

    // ✅ RENTAL MANAGEMENT: Get users by role and location
    public List<User> getUsersByRoleAndLocation(User.UserRole role, String location) {
        return userRepository.findByUserRoleAndLocation(role, location);
    }

    // ✅ ANALYTICS: Get role distribution statistics
    public Map<String, Long> getRoleDistribution() {
        List<Object[]> roleStats = userRepository.getUserRoleDistribution();
        Map<String, Long> distribution = new HashMap<>();

        for (Object[] stat : roleStats) {
            distribution.put((String) stat[0], ((Number) stat[1]).longValue());
        }

        return distribution;
    }

    // ✅ ANALYTICS: Get business user statistics
    public BusinessUserStats getBusinessUserStatistics() {
        Object[] stats = userRepository.getBusinessUserStatistics();

        if (stats != null && stats.length >= 3) {
            return new BusinessUserStats(
                    ((Number) stats[0]).longValue(), // total business users
                    ((Number) stats[1]).longValue(), // owners count
                    ((Number) stats[2]).longValue()  // businesses count
            );
        }

        return new BusinessUserStats(0L, 0L, 0L);
    }


    /**
     * Reactivate user account
     */
    public void reactivateUser(String email) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setActive(true);
            // Only enable if email is verified
            if (user.isEmailVerified()) {
                user.setEnabled(true);
            }
            userRepository.save(user);
            System.out.println("✅ User reactivated: " + email);
        } else {
            System.err.println("❌ Cannot reactivate - User not found: " + email);
            throw new RuntimeException("User not found: " + email);
        }
    }

    // ✅ UTILITY METHODS - Enhanced security and functionality

    /**
     * Generate a secure verification/reset token
     */
    private String generateSecureToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * Check if email is available for registration
     */
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmailIgnoreCase(email);
    }

    /**
     * Get recent user registrations (last 30 days)
     */
    public List<User> getRecentRegistrations() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return userRepository.findRecentUsers(thirtyDaysAgo);
    }

    /**
     * Get users by email domain for analytics
     */
    public List<User> getUsersByDomain(String domain) {
        return userRepository.findByEmailDomain(domain);
    }

    // ✅ INNER CLASS FOR STATISTICS - Enhanced with additional metrics
    public static class UserStatistics {
        private final long totalUsers;
        private final long activeUsers;
        private final long verifiedUsers;
        private final long unverifiedUsers;

        public UserStatistics(long totalUsers, long activeUsers, long verifiedUsers, long unverifiedUsers) {
            this.totalUsers = totalUsers;
            this.activeUsers = activeUsers;
            this.verifiedUsers = verifiedUsers;
            this.unverifiedUsers = unverifiedUsers;
        }

        // Getters
        public long getTotalUsers() { return totalUsers; }
        public long getActiveUsers() { return activeUsers; }
        public long getVerifiedUsers() { return verifiedUsers; }
        public long getUnverifiedUsers() { return unverifiedUsers; }

        // Additional computed metrics
        public double getVerificationRate() {
            return totalUsers > 0 ? (double) verifiedUsers / totalUsers * 100.0 : 0.0;
        }

        public double getActiveUserRate() {
            return totalUsers > 0 ? (double) activeUsers / totalUsers * 100.0 : 0.0;
        }

        @Override
        public String toString() {
            return "UserStatistics{" +
                    "totalUsers=" + totalUsers +
                    ", activeUsers=" + activeUsers +
                    ", verifiedUsers=" + verifiedUsers +
                    ", unverifiedUsers=" + unverifiedUsers +
                    ", verificationRate=" + String.format("%.2f%%", getVerificationRate()) +
                    ", activeUserRate=" + String.format("%.2f%%", getActiveUserRate()) +
                    '}';
        }


    }
    // ✅ AUTHENTICATION RESULT CLASS
    public static class AuthenticationResult {
        private final User user;
        private final User.UserRole role;
        private final String location;
        private final boolean isBusinessUser;
        private final boolean hasBusinessInfo;
        private final SessionData sessionData;

        public AuthenticationResult(User user, User.UserRole role, String location,
                                    boolean isBusinessUser, boolean hasBusinessInfo,
                                    SessionData sessionData) {
            this.user = user;
            this.role = role;
            this.location = location;
            this.isBusinessUser = isBusinessUser;
            this.hasBusinessInfo = hasBusinessInfo;
            this.sessionData = sessionData;
        }

        // Getters
        public User getUser() { return user; }
        public User.UserRole getRole() { return role; }
        public String getLocation() { return location; }
        public boolean isBusinessUser() { return isBusinessUser; }
        public boolean hasBusinessInfo() { return hasBusinessInfo; }
        public SessionData getSessionData() { return sessionData; }
    }

    // ✅ SESSION DATA CLASS
    public static class SessionData {
        private final String sessionId;
        private final String refreshToken;
        private final LocalDateTime expiresAt;

        public SessionData(String sessionId, String refreshToken, LocalDateTime expiresAt) {
            this.sessionId = sessionId;
            this.refreshToken = refreshToken;
            this.expiresAt = expiresAt;
        }

        // Getters
        public String getSessionId() { return sessionId; }
        public String getRefreshToken() { return refreshToken; }
        public LocalDateTime getExpiresAt() { return expiresAt; }
    }

    // ✅ BUSINESS USER STATISTICS CLASS
    public static class BusinessUserStats {
        private final long totalBusinessUsers;
        private final long ownersCount;
        private final long businessesCount;

        public BusinessUserStats(long totalBusinessUsers, long ownersCount, long businessesCount) {
            this.totalBusinessUsers = totalBusinessUsers;
            this.ownersCount = ownersCount;
            this.businessesCount = businessesCount;
        }

        // Getters
        public long getTotalBusinessUsers() { return totalBusinessUsers; }
        public long getOwnersCount() { return ownersCount; }
        public long getBusinessesCount() { return businessesCount; }

        public double getOwnerPercentage() {
            return totalBusinessUsers > 0 ? (double) ownersCount / totalBusinessUsers * 100.0 : 0.0;
        }
    }

}

