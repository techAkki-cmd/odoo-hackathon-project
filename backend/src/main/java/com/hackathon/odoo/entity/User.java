package com.hackathon.odoo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * User Entity Class - Enhanced for Rental Management Platform
 * Supports multi-role authentication with business information
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_verification_token", columnList = "verification_token"),
        @Index(name = "idx_created_at", columnList = "created_at"),
        @Index(name = "idx_user_role", columnList = "user_role")
})
public class User {

    // ✅ PRIMARY KEY
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ BASIC USER INFORMATION
    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    // ✅ USER ROLE FOR RENTAL MANAGEMENT
    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private UserRole userRole = UserRole.CUSTOMER;

    // ✅ LOCATION FIELD (matches frontend)
    @Column(nullable = false, length = 255)
    private String location;

    // ✅ BUSINESS INFORMATION (for property owners)
    @Column(name = "business_name", length = 100)
    private String businessName;

    @Column(name = "business_license", length = 50)
    private String businessLicense;

    @Enumerated(EnumType.STRING)
    @Column(name = "business_type")
    private BusinessType businessType;

    // ✅ ACCOUNT STATUS FIELDS
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean enabled = false;

    @Column(name = "email_verified", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean emailVerified = false;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private boolean active = true;

    // ✅ PROFILE INFORMATION
    @Column(length = 15)
    private String phoneNumber;

    // ✅ ADD THIS FIELD
    @Column(name = "is_profile_public", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isProfilePublic = false;

    // ✅ ADD THESE METHODS
    public boolean isProfilePublic() {
        return isProfilePublic;
    }

    public void setProfilePublic(boolean profilePublic) {
        this.isProfilePublic = profilePublic;
    }


    @Column(name = "profile_photo_url", length = 500)
    private String profilePhotoUrl;

    @Column(length = 1000)
    private String bio;

    // ✅ RATING SYSTEM (for rental platform)
    @Column(name = "average_rating", precision = 3, scale = 2)
    private Double averageRating = 0.0;

    @Column(name = "total_reviews", nullable = false)
    private Integer totalReviews = 0;

    @Column(name = "total_rentals", nullable = false)
    private Integer totalRentals = 0;

    // ✅ EMAIL VERIFICATION FIELDS
    @Column(name = "verification_token", length = 255)
    private String verificationToken;

    @Column(name = "token_expiration")
    private LocalDateTime tokenExpiration;

    // ✅ SECURITY FIELDS
    @Column(name = "login_attempts", nullable = false)
    private Integer loginAttempts = 0;

    @Column(name = "lockout_time")
    private LocalDateTime lockoutTime;

    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;

    // ✅ AUDIT FIELDS
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ✅ ENUMS FOR RENTAL MANAGEMENT
    public enum UserRole {
        CUSTOMER, OWNER, BUSINESS, ADMIN, SUPER_ADMIN
    }

    public enum BusinessType {
        EQUIPMENT_RENTAL, PROPERTY_RENTAL, VEHICLE_RENTAL, INDIVIDUAL
    }

    // ✅ CONSTRUCTORS
    public User() {
        // Default constructor required by JPA
    }

    public User(String email, String password, String firstName, String lastName,
                UserRole userRole, String location) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userRole = userRole != null ? userRole : UserRole.CUSTOMER;
        this.location = location;

        // Set default values
        this.enabled = false;
        this.emailVerified = false;
        this.active = true;
        this.loginAttempts = 0;
        this.totalReviews = 0;
        this.totalRentals = 0;
        this.averageRating = 0.0;
    }

    // ✅ GETTERS AND SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public UserRole getUserRole() { return userRole; }
    public void setUserRole(UserRole userRole) { this.userRole = userRole; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getBusinessLicense() { return businessLicense; }
    public void setBusinessLicense(String businessLicense) { this.businessLicense = businessLicense; }

    public BusinessType getBusinessType() { return businessType; }
    public void setBusinessType(BusinessType businessType) { this.businessType = businessType; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public Integer getTotalRentals() { return totalRentals; }
    public void setTotalRentals(Integer totalRentals) { this.totalRentals = totalRentals; }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public LocalDateTime getTokenExpiration() { return tokenExpiration; }
    public void setTokenExpiration(LocalDateTime tokenExpiration) { this.tokenExpiration = tokenExpiration; }

    public Integer getLoginAttempts() { return loginAttempts; }
    public void setLoginAttempts(Integer loginAttempts) { this.loginAttempts = loginAttempts; }

    public LocalDateTime getLockoutTime() { return lockoutTime; }
    public void setLockoutTime(LocalDateTime lockoutTime) { this.lockoutTime = lockoutTime; }

    public LocalDateTime getLastLoginTime() { return lastLoginTime; }
    public void setLastLoginTime(LocalDateTime lastLoginTime) { this.lastLoginTime = lastLoginTime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // ✅ JPA LIFECYCLE CALLBACKS
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        // Set default values if not set
        if (this.userRole == null) {
            this.userRole = UserRole.CUSTOMER;
        }
        if (this.totalReviews == null) {
            this.totalReviews = 0;
        }
        if (this.totalRentals == null) {
            this.totalRentals = 0;
        }
        if (this.averageRating == null) {
            this.averageRating = 0.0;
        }
        if (this.loginAttempts == null) {
            this.loginAttempts = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ✅ UTILITY METHODS FOR RENTAL MANAGEMENT
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public boolean isTokenExpired() {
        return tokenExpiration != null && LocalDateTime.now().isAfter(tokenExpiration);
    }

    public boolean isFullyActivated() {
        return enabled && emailVerified && active;
    }

    public boolean hasValidToken() {
        return verificationToken != null && !isTokenExpired();
    }

    public boolean isBusinessUser() {
        return userRole == UserRole.OWNER || userRole == UserRole.BUSINESS;
    }

    public boolean isCustomer() {
        return userRole == UserRole.CUSTOMER;
    }

    public boolean isAdmin() {
        return userRole == UserRole.ADMIN || userRole == UserRole.SUPER_ADMIN;
    }

    public boolean hasBusinessInfo() {
        return businessName != null && !businessName.trim().isEmpty();
    }

    public boolean isAccountLocked() {
        return lockoutTime != null && LocalDateTime.now().isBefore(lockoutTime);
    }

    public void incrementLoginAttempts() {
        this.loginAttempts = (this.loginAttempts == null ? 0 : this.loginAttempts) + 1;
    }

    public void resetLoginAttempts() {
        this.loginAttempts = 0;
        this.lockoutTime = null;
    }

    public void lockAccount(int minutesToLock) {
        this.lockoutTime = LocalDateTime.now().plusMinutes(minutesToLock);
    }

    public String getDisplayName() {
        if (businessName != null && !businessName.trim().isEmpty()) {
            return businessName;
        }
        return getFullName();
    }

    public boolean hasGoodRating() {
        return averageRating != null && averageRating >= 4.0;
    }

    public boolean isExperiencedUser() {
        return totalRentals != null && totalRentals >= 5;
    }

    public void updateLastLogin() {
        this.lastLoginTime = LocalDateTime.now();
    }

    // ✅ toString for debugging (exclude sensitive info)
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", userRole=" + userRole +
                ", location='" + location + '\'' +
                ", businessName='" + businessName + '\'' +
                ", enabled=" + enabled +
                ", emailVerified=" + emailVerified +
                ", active=" + active +
                ", totalRentals=" + totalRentals +
                ", averageRating=" + averageRating +
                ", createdAt=" + createdAt +
                '}';
    }
}
