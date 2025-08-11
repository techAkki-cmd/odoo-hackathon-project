package com.hackathon.odoo.dto;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.hackathon.odoo.entity.User;

/**
 * RegisterRequest DTO - Enhanced for Rental Management Platform
 *
 * This DTO handles incoming registration requests with role-based registration:
 * - Supports multi-role authentication (Customer, Owner, Business, Admin)
 * - Includes location field for local rental matching
 * - Business information for property owners
 * - Validates all fields using Bean Validation
 * - Maps perfectly to enhanced User entity
 */
public class RegisterRequest {

    // ✅ EXISTING FIELDS (keep your current validation)
    @NotNull(message = "First name is required")
    @NotBlank(message = "First name cannot be empty")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'-]+$", message = "First name can only contain letters, spaces, hyphens, and apostrophes")
    @JsonProperty("firstName")
    private String firstName;

    @NotNull(message = "Last name is required")
    @NotBlank(message = "Last name cannot be empty")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'-]+$", message = "Last name can only contain letters, spaces, hyphens, and apostrophes")
    @JsonProperty("lastName")
    private String lastName;

    @NotNull(message = "Email address is required")
    @NotBlank(message = "Email address cannot be empty")
    @Email(message = "Please enter a valid email address")
    @Size(max = 255, message = "Email address is too long (maximum 255 characters)")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Email format is invalid")
    @JsonProperty("email")
    private String email;

    @NotNull(message = "Password is required")
    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    @JsonProperty("password")
    private String password;

    // ✅ NEW: RENTAL MANAGEMENT SPECIFIC FIELDS
    @NotNull(message = "User role is required")
    @JsonProperty("userRole")
    private User.UserRole userRole = User.UserRole.CUSTOMER;

    @NotNull(message = "Location is required")
    @NotBlank(message = "Location cannot be empty")
    @Size(max = 255, message = "Location is too long")
    @JsonProperty("location")
    private String location;

    // ✅ NEW: BUSINESS INFORMATION (Optional - for property owners)
    @Size(max = 100, message = "Business name is too long")
    @JsonProperty("businessName")
    private String businessName;

    @Size(max = 50, message = "Business license number is too long")
    @JsonProperty("businessLicense")
    private String businessLicense;

    @JsonProperty("businessType")
    private User.BusinessType businessType;

    // ✅ CONSTRUCTORS
    public RegisterRequest() {
    }

    // Basic constructor (existing fields)
    public RegisterRequest(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.userRole = User.UserRole.CUSTOMER; // Default
    }

    // Enhanced constructor (with rental management fields)
    public RegisterRequest(String firstName, String lastName, String email, String password,
                           User.UserRole userRole, String location) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.userRole = userRole;
        this.location = location;
    }

    // ✅ EXISTING GETTERS AND SETTERS (keep your current ones)
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName != null ? firstName.trim() : null;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName != null ? lastName.trim() : null;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email != null ? email.trim().toLowerCase() : null;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ✅ NEW: RENTAL MANAGEMENT GETTERS AND SETTERS
    public User.UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(User.UserRole userRole) {
        this.userRole = userRole != null ? userRole : User.UserRole.CUSTOMER;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location != null ? location.trim() : null;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName != null ? businessName.trim() : null;
    }

    public String getBusinessLicense() {
        return businessLicense;
    }

    public void setBusinessLicense(String businessLicense) {
        this.businessLicense = businessLicense != null ? businessLicense.trim() : null;
    }

    public User.BusinessType getBusinessType() {
        return businessType;
    }

    public void setBusinessType(User.BusinessType businessType) {
        this.businessType = businessType;
    }

    // ✅ ENHANCED UTILITY METHODS
    public String getFullName() {
        if (firstName == null && lastName == null) {
            return null;
        }
        if (firstName == null) {
            return lastName;
        }
        if (lastName == null) {
            return firstName;
        }
        return firstName + " " + lastName;
    }

    public boolean hasAllRequiredFields() {
        return firstName != null && !firstName.trim().isEmpty() &&
                lastName != null && !lastName.trim().isEmpty() &&
                email != null && !email.trim().isEmpty() &&
                password != null && !password.trim().isEmpty() &&
                userRole != null &&
                location != null && !location.trim().isEmpty();
    }

    public String getEmailDomain() {
        if (email == null || !email.contains("@")) {
            return null;
        }
        return email.substring(email.lastIndexOf("@") + 1);
    }

    // ✅ NEW: RENTAL MANAGEMENT UTILITY METHODS
    public boolean isBusinessUser() {
        return userRole == User.UserRole.OWNER || userRole == User.UserRole.BUSINESS;
    }

    public boolean hasBusinessInfo() {
        return businessName != null && !businessName.trim().isEmpty();
    }

    public boolean isBusinessInfoRequired() {
        return isBusinessUser();
    }

    public boolean hasValidBusinessInfo() {
        if (!isBusinessUser()) {
            return true; // Not required for customers
        }
        return hasBusinessInfo(); // Required for business users
    }

    public String getDisplayName() {
        if (hasBusinessInfo()) {
            return businessName;
        }
        return getFullName();
    }

    // ✅ ENHANCED SANITIZE METHOD
    public void sanitize() {
        if (firstName != null) {
            firstName = firstName.trim();
        }
        if (lastName != null) {
            lastName = lastName.trim();
        }
        if (email != null) {
            email = email.trim().toLowerCase();
        }
        if (location != null) {
            location = location.trim();
        }
        if (businessName != null) {
            businessName = businessName.trim();
        }
        if (businessLicense != null) {
            businessLicense = businessLicense.trim();
        }
        // Password is NOT trimmed to preserve intentional spaces
    }

    // ✅ VALIDATION HELPER METHOD
    public boolean isValidForRegistration() {
        return hasAllRequiredFields() && hasValidBusinessInfo();
    }

    // ✅ ENHANCED toString METHOD (excludes password for security)
    @Override
    public String toString() {
        return "RegisterRequest{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                ", userRole=" + userRole +
                ", location='" + location + '\'' +
                ", businessName='" + businessName + '\'' +
                ", businessType=" + businessType +
                ", hasBusinessInfo=" + hasBusinessInfo() +
                '}';
    }

    // ✅ UPDATED equals AND hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RegisterRequest that = (RegisterRequest) o;

        if (firstName != null ? !firstName.equals(that.firstName) : that.firstName != null) return false;
        if (lastName != null ? !lastName.equals(that.lastName) : that.lastName != null) return false;
        if (email != null ? !email.equals(that.email) : that.email != null) return false;
        if (userRole != that.userRole) return false;
        return location != null ? location.equals(that.location) : that.location == null;
    }

    @Override
    public int hashCode() {
        int result = firstName != null ? firstName.hashCode() : 0;
        result = 31 * result + (lastName != null ? lastName.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (userRole != null ? userRole.hashCode() : 0);
        result = 31 * result + (location != null ? location.hashCode() : 0);
        return result;
    }
}
