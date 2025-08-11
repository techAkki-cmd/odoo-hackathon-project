package com.hackathon.odoo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * User Entity Class - Corrected Boolean Naming Conventions
 *
 * This class uses primitive boolean types with proper 'is' prefix getters
 * to match Java naming conventions and fix compilation errors.
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_verification_token", columnList = "verification_token"),
        @Index(name = "idx_created_at", columnList = "created_at")
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

    // ✅ ACCOUNT STATUS FIELDS - Using primitive boolean with proper naming
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean enabled = false;

    @Column(name = "email_verified", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean emailVerified = false;

    @Column(name = "is_profile_public", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isProfilePublic = false;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
    private boolean active = true;

    // ✅ PRIVACY & NOTIFICATION PREFERENCES - Using primitive boolean
    @Column(name = "receive_notifications", nullable = false, columnDefinition = "BIT DEFAULT 1")
    private boolean receiveNotifications = true;

    @Column(name = "show_email", nullable = false, columnDefinition = "BIT DEFAULT 0")
    private boolean showEmail = false;

    @Column(name = "show_location", nullable = false, columnDefinition = "BIT DEFAULT 0")
    private boolean showLocation = false;

    // ✅ PROFILE VISIBILITY ENUM
    @Enumerated(EnumType.STRING)
    @Column(name = "profile_visibility")
    private ProfileVisibility profileVisibility;

    // ✅ PROFILE INFORMATION
    @Column(length = 1000)
    private String bio;

    @Column(length = 100)
    private String location;

    @Column(length = 100)
    private String company;

    @Column(length = 100)
    private String profession;

    @Column(name = "availability", length = 500)
    private String availability;

    @Column(name = "social_links", length = 500)
    private String socialLinks;

    // ✅ PROFILE PHOTOS
    @Column(name = "profile_photo", length = 500)
    private String profilePhoto;

    @Column(name = "profile_photo_url", length = 500)
    private String profilePhotoUrl;

    // ✅ RATING AND REVIEW SYSTEM
    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    // ✅ ACTIVITY TRACKING
    @Column(name = "completed_swaps", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer completedSwaps = 0;

    @Column(name = "profile_completed_at")
    private LocalDateTime profileCompletedAt;

    // ✅ EMAIL VERIFICATION FIELDS
    @Column(name = "verification_token", length = 255)
    private String verificationToken;

    @Column(name = "token_expiration")
    private LocalDateTime tokenExpiration;

    // ✅ AUDIT FIELDS
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ✅ ENUM FOR PROFILE VISIBILITY
    public enum ProfileVisibility {
        LIMITED, PRIVATE, PUBLIC
    }

    // ✅ CONSTRUCTORS
    public User() {
        // Default constructor required by JPA
    }

    public User(String email, String password, String firstName, String lastName) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        // Set default values explicitly
        this.enabled = false;
        this.emailVerified = false;
        this.active = true;
        this.receiveNotifications = true;
        this.showEmail = false;
        this.showLocation = false;
        this.isProfilePublic = false;
        this.completedSwaps = 0;
        this.profileVisibility = ProfileVisibility.PRIVATE;
    }

    // ✅ GETTERS AND SETTERS - CORRECT BOOLEAN NAMING CONVENTIONS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    // ✅ CORRECT boolean getters with 'is' prefix
    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isReceiveNotifications() {
        return receiveNotifications;
    }

    public void setReceiveNotifications(boolean receiveNotifications) {
        this.receiveNotifications = receiveNotifications;
    }

    public boolean isShowEmail() {
        return showEmail;
    }

    public void setShowEmail(boolean showEmail) {
        this.showEmail = showEmail;
    }

    public boolean isShowLocation() {
        return showLocation;
    }

    public void setShowLocation(boolean showLocation) {
        this.showLocation = showLocation;
    }

    public boolean isProfilePublic() {
        return isProfilePublic;
    }

    public void setProfilePublic(boolean profilePublic) {
        isProfilePublic = profilePublic;
    }

    public ProfileVisibility getProfileVisibility() {
        return profileVisibility;
    }

    public void setProfileVisibility(ProfileVisibility profileVisibility) {
        this.profileVisibility = profileVisibility;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getSocialLinks() {
        return socialLinks;
    }

    public void setSocialLinks(String socialLinks) {
        this.socialLinks = socialLinks;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Integer getCompletedSwaps() {
        return completedSwaps;
    }

    public void setCompletedSwaps(Integer completedSwaps) {
        this.completedSwaps = completedSwaps;
    }

    public LocalDateTime getProfileCompletedAt() {
        return profileCompletedAt;
    }

    public void setProfileCompletedAt(LocalDateTime profileCompletedAt) {
        this.profileCompletedAt = profileCompletedAt;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public LocalDateTime getTokenExpiration() {
        return tokenExpiration;
    }

    public void setTokenExpiration(LocalDateTime tokenExpiration) {
        this.tokenExpiration = tokenExpiration;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // ✅ JPA LIFECYCLE CALLBACKS
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        // Set default values for required fields if not set
        if (this.completedSwaps == null) {
            this.completedSwaps = 0;
        }
        if (this.profileVisibility == null) {
            this.profileVisibility = ProfileVisibility.PRIVATE;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ✅ UTILITY METHODS
    public String getFullName() {
        return firstName + " " + lastName;
    }

    public boolean isTokenExpired() {
        return tokenExpiration != null && LocalDateTime.now().isAfter(tokenExpiration);
    }

    // ✅ ENHANCED CONVENIENCE METHODS
    public boolean isFullyActivated() {
        return enabled && emailVerified && active;
    }

    public boolean canReceiveEmails() {
        return receiveNotifications && active;
    }

    public boolean isEmailVisibleInProfile() {
        return showEmail && (isProfilePublic || profileVisibility == ProfileVisibility.PUBLIC);
    }

    public boolean isLocationVisibleInProfile() {
        return showLocation && (isProfilePublic || profileVisibility == ProfileVisibility.PUBLIC);
    }

    public String getDisplayName() {
        if (lastName != null && !lastName.isEmpty()) {
            return firstName + " " + lastName.charAt(0) + ".";
        }
        return firstName;
    }

    public boolean hasValidToken() {
        return verificationToken != null && !isTokenExpired();
    }

    public String getContactEmail() {
        return showEmail ? email : null;
    }

    public String getPublicLocation() {
        return showLocation ? location : null;
    }

    public boolean isProfileComplete() {
        return profileCompletedAt != null;
    }

    public void markProfileComplete() {
        this.profileCompletedAt = LocalDateTime.now();
    }

    public boolean hasProfilePhoto() {
        return (profilePhoto != null && !profilePhoto.trim().isEmpty()) ||
                (profilePhotoUrl != null && !profilePhotoUrl.trim().isEmpty());
    }

    public String getProfileImageUrl() {
        return profilePhotoUrl != null ? profilePhotoUrl : profilePhoto;
    }

    public boolean hasGoodRating() {
        return averageRating != null && averageRating >= 4.0;
    }

    public boolean isExperiencedUser() {
        return completedSwaps != null && completedSwaps >= 5;
    }

    // ✅ toString for debugging (exclude password and sensitive info)
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", enabled=" + enabled +
                ", emailVerified=" + emailVerified +
                ", active=" + active +
                ", company='" + company + '\'' +
                ", profession='" + profession + '\'' +
                ", profileVisibility=" + profileVisibility +
                ", averageRating=" + averageRating +
                ", completedSwaps=" + completedSwaps +
                ", createdAt=" + createdAt +
                '}';
    }
}
