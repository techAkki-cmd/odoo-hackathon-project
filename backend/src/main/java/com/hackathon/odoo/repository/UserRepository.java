package com.hackathon.odoo.repository;

import com.hackathon.odoo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.hackathon.odoo.entity.User.UserRole;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * UserRepository Interface - Data Access Layer
 *
 * This repository interface provides comprehensive data access methods for User entity:
 * - Basic CRUD operations (inherited from JpaRepository)
 * - Custom finder methods for user authentication and management
 * - Email verification and token management
 * - User search and filtering capabilities
 * - Bulk operations for user management
 *
 * Spring Data JPA automatically implements all methods at runtime
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ AUTHENTICATION & LOGIN QUERIES

    /**
     * Find user by email address (used for login)
     * @param email the user's email address
     * @return Optional containing user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by email address (case insensitive)
     * @param email the user's email address
     * @return Optional containing user if found
     */
    Optional<User> findByEmailIgnoreCase(String email);

    /**
     * Check if email already exists in database
     * @param email the email to check
     * @return true if email exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Check if email exists (case insensitive)
     * @param email the email to check
     * @return true if email exists, false otherwise
     */
    boolean existsByEmailIgnoreCase(String email);

    // ✅ EMAIL VERIFICATION QUERIES

    /**
     * Find user by verification token
     * @param token the verification token
     * @return Optional containing user if token is valid
     */
    Optional<User> findByVerificationToken(String token);

    /**
     * Find user by verification token that hasn't expired
     * @param token the verification token
     * @param currentTime the current timestamp
     * @return Optional containing user if token is valid and not expired
     */
    @Query("SELECT u FROM User u WHERE u.verificationToken = :token AND u.tokenExpiration > :currentTime")
    Optional<User> findByValidVerificationToken(@Param("token") String token,
                                                @Param("currentTime") LocalDateTime currentTime);

    /**
     * Find all users with expired verification tokens
     * @param currentTime the current timestamp
     * @return List of users with expired tokens
     */
    @Query("SELECT u FROM User u WHERE u.verificationToken IS NOT NULL AND u.tokenExpiration < :currentTime")
    List<User> findUsersWithExpiredTokens(@Param("currentTime") LocalDateTime currentTime);

    // ✅ USER STATUS QUERIES

    /**
     * Find all active users
     * @return List of active users
     */
    List<User> findByActiveTrue();

    /**
     * Find all inactive/deleted users
     * @return List of inactive users
     */
    List<User> findByActiveFalse();

    /**
     * Find all enabled users (email verified)
     * @return List of enabled users
     */
    List<User> findByEnabledTrue();

    /**
     * Find all disabled users (email not verified)
     * @return List of disabled users
     */
    List<User> findByEnabledFalse();

    /**
     * Find all users with verified emails
     * @return List of users with verified emails
     */
    List<User> findByEmailVerifiedTrue();

    /**
     * Find all users with unverified emails
     * @return List of users with unverified emails
     */
    List<User> findByEmailVerifiedFalse();

    // ✅ USER SEARCH QUERIES

    /**
     * Find users by first name (case insensitive, partial match)
     * @param firstName the first name to search for
     * @return List of matching users
     */
    List<User> findByFirstNameContainingIgnoreCase(String firstName);

    /**
     * Find users by last name (case insensitive, partial match)
     * @param lastName the last name to search for
     * @return List of matching users
     */
    List<User> findByLastNameContainingIgnoreCase(String lastName);

    /**
     * Find users by full name search (first name OR last name)
     * @param searchTerm the search term
     * @return List of matching users
     */
    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> findByFullNameContaining(@Param("searchTerm") String searchTerm);

    /**
     * Find users by email domain
     * @param domain the email domain (e.g., "gmail.com")
     * @return List of users with matching domain
     */
    @Query("SELECT u FROM User u WHERE u.email LIKE CONCAT('%@', :domain)")
    List<User> findByEmailDomain(@Param("domain") String domain);

    // ✅ PAGINATION & SORTING QUERIES

    /**
     * Find all active users with pagination
     * @param pageable pagination information
     * @return Page of active users
     */
    Page<User> findByActiveTrue(Pageable pageable);

    /**
     * Find all enabled users with pagination
     * @param pageable pagination information
     * @return Page of enabled users
     */
    Page<User> findByEnabledTrue(Pageable pageable);

    /**
     * Find users created after a specific date with pagination
     * @param date the date threshold
     * @param pageable pagination information
     * @return Page of users created after the date
     */
    Page<User> findByCreatedAtAfter(LocalDateTime date, Pageable pageable);

    // ✅ CUSTOM JPQL QUERIES

    /**
     * Get user statistics
     * @return Array containing [totalUsers, activeUsers, verifiedUsers, unverifiedUsers]
     */
    @Query("SELECT " +
            "COUNT(u), " +
            "SUM(CASE WHEN u.active = true THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN u.emailVerified = true THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN u.emailVerified = false THEN 1 ELSE 0 END) " +
            "FROM User u")
    Object[] getUserStatistics();

    /**
     * Find recently registered users (last 30 days)
     * @param thirtyDaysAgo date 30 days ago
     * @return List of recently registered users
     */
    @Query("SELECT u FROM User u WHERE u.createdAt >= :thirtyDaysAgo ORDER BY u.createdAt DESC")
    List<User> findRecentUsers(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);

    /**
     * Find public profile users
     * @return List of users with public profiles
     */
    List<User> findByIsProfilePublicTrue();

    // ✅ BULK UPDATE OPERATIONS

    /**
     * Update user's email verification status
     * @param userId the user ID
     * @param verified the verification status
     * @return number of updated records
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.emailVerified = :verified, u.enabled = :verified WHERE u.id = :userId")
    int updateEmailVerificationStatus(@Param("userId") Long userId, @Param("verified") boolean verified);

    /**
     * Clear verification token after successful verification
     * @param userId the user ID
     * @return number of updated records
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.verificationToken = NULL, u.tokenExpiration = NULL WHERE u.id = :userId")
    int clearVerificationToken(@Param("userId") Long userId);

    /**
     * Update user's last login timestamp (if you add this field later)
     * @param userId the user ID
     * @param lastLogin the last login timestamp
     * @return number of updated records
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.updatedAt = :lastLogin WHERE u.id = :userId")
    int updateLastLogin(@Param("userId") Long userId, @Param("lastLogin") LocalDateTime lastLogin);

    /**
     * Soft delete users (mark as inactive instead of actual deletion)
     * @param userIds list of user IDs to deactivate
     * @return number of updated records
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.active = false WHERE u.id IN :userIds")
    int deactivateUsers(@Param("userIds") List<Long> userIds);

    /**
     * Clean up expired verification tokens
     * @param currentTime current timestamp
     * @return number of cleaned up records
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.verificationToken = NULL, u.tokenExpiration = NULL " +
            "WHERE u.verificationToken IS NOT NULL AND u.tokenExpiration < :currentTime")
    int cleanupExpiredTokens(@Param("currentTime") LocalDateTime currentTime);

    // ✅ NATIVE SQL QUERIES (for complex operations)

    /**
     * Get monthly user registration statistics
     * @return List of monthly registration counts
     */
    @Query(value = "SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count " +
            "FROM users " +
            "GROUP BY DATE_FORMAT(created_at, '%Y-%m') " +
            "ORDER BY month DESC " +
            "LIMIT 12",
            nativeQuery = true)
    List<Object[]> getMonthlyRegistrationStats();

    /**
     * Find users by email domain with count
     * @return List of domain statistics
     */
    @Query(value = "SELECT SUBSTRING_INDEX(email, '@', -1) as domain, COUNT(*) as count " +
            "FROM users " +
            "GROUP BY SUBSTRING_INDEX(email, '@', -1) " +
            "ORDER BY count DESC",
            nativeQuery = true)
    List<Object[]> getEmailDomainStatistics();

    // ✅ RENTAL MANAGEMENT SPECIFIC QUERIES (ADD THESE TO YOUR EXISTING REPOSITORY)

    /**
     * Find users by role (for role-based authentication)
     * @param userRole the user role to search for
     * @return List of users with the specified role
     */
    List<User> findByUserRole(User.UserRole userRole);

    /**
     * Find users by role with pagination
     * @param userRole the user role to search for
     * @param pageable pagination information
     * @return Page of users with the specified role
     */
    Page<User> findByUserRole(User.UserRole userRole, Pageable pageable);

    /**
     * Find users by location (case insensitive, partial match)
     * @param location the location to search for
     * @return List of users in the specified location
     */
    List<User> findByLocationContainingIgnoreCase(String location);

    /**
     * Find users by role and location
     * @param userRole the user role
     * @param location the location (partial match)
     * @return List of users matching role and location
     */
    @Query("SELECT u FROM User u WHERE u.userRole = :userRole AND LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<User> findByUserRoleAndLocation(@Param("userRole") User.UserRole userRole,
                                         @Param("location") String location);

    /**
     * Find business users (owners and businesses) in a location
     * @param location the location to search
     * @return List of business users in the location
     */
    @Query("SELECT u FROM User u WHERE u.userRole IN ('OWNER', 'BUSINESS') AND LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<User> findBusinessUsersInLocation(@Param("location") String location);

    /**
     * Find customers in a location
     * @param location the location to search
     * @return List of customers in the location
     */
    @Query("SELECT u FROM User u WHERE u.userRole = 'CUSTOMER' AND LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<User> findCustomersInLocation(@Param("location") String location);

    /**
     * Find users with business information
     * @return List of users who have filled business details
     */
    @Query("SELECT u FROM User u WHERE u.businessName IS NOT NULL AND u.businessName != ''")
    List<User> findUsersWithBusinessInfo();

    /**
     * Check if email exists for a specific role
     * @param email the email to check
     * @param userRole the user role
     * @return true if email exists for the role
     */
    boolean existsByEmailAndUserRole(String email, User.UserRole userRole);

// ✅ SECURITY QUERIES FOR LOGIN ATTEMPTS

    /**
     * Find users with failed login attempts
     * @param maxAttempts the maximum allowed attempts
     * @return List of users with high login attempts
     */
    @Query("SELECT u FROM User u WHERE u.loginAttempts >= :maxAttempts")
    List<User> findUsersWithHighLoginAttempts(@Param("maxAttempts") Integer maxAttempts);

    /**
     * Find currently locked out users
     * @param currentTime current timestamp
     * @return List of locked out users
     */
    @Query("SELECT u FROM User u WHERE u.lockoutTime IS NOT NULL AND u.lockoutTime > :currentTime")
    List<User> findLockedOutUsers(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Update user login attempts
     * @param userId the user ID
     * @param attempts the number of attempts
     * @return number of updated records
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.loginAttempts = :attempts WHERE u.id = :userId")
    int updateLoginAttempts(@Param("userId") Long userId, @Param("attempts") Integer attempts);

    /**
     * Reset login attempts and clear lockout
     * @param userId the user ID
     * @return number of updated records
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.loginAttempts = 0, u.lockoutTime = NULL WHERE u.id = :userId")
    int resetLoginAttempts(@Param("userId") Long userId);

    /**
     * Set user lockout time
     * @param userId the user ID
     * @param lockoutTime the lockout expiration time
     * @return number of updated records
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lockoutTime = :lockoutTime WHERE u.id = :userId")
    int setUserLockout(@Param("userId") Long userId, @Param("lockoutTime") LocalDateTime lockoutTime);

    /**
     * Update last login time
     * @param userId the user ID
     * @param lastLoginTime the last login timestamp
     * @return number of updated records
     */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastLoginTime = :lastLoginTime WHERE u.id = :userId")
    int updateLastLoginTime(@Param("userId") Long userId, @Param("lastLoginTime") LocalDateTime lastLoginTime);

// ✅ RENTAL PLATFORM STATISTICS

    /**
     * Get user role distribution statistics
     * @return List of role counts [role, count]
     */
    @Query(value = "SELECT user_role, COUNT(*) FROM users GROUP BY user_role", nativeQuery = true)
    List<Object[]> getUserRoleDistribution();

    /**
     * Get location-wise user statistics
     * @return List of location statistics [location, userCount]
     */
    @Query(value = "SELECT location, COUNT(*) as user_count FROM users WHERE location IS NOT NULL GROUP BY location ORDER BY user_count DESC LIMIT 10", nativeQuery = true)
    List<Object[]> getTopLocationsByUsers();

    /**
     * Get business user statistics
     * @return Array containing [totalBusinessUsers, ownersCount, businessesCount]
     */
    @Query("SELECT " +
            "SUM(CASE WHEN u.userRole IN ('OWNER', 'BUSINESS') THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN u.userRole = 'OWNER' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN u.userRole = 'BUSINESS' THEN 1 ELSE 0 END) " +
            "FROM User u")
    Object[] getBusinessUserStatistics();

}


