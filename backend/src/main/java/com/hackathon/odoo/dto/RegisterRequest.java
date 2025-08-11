package com.hackathon.odoo.dto;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * RegisterRequest DTO - Data Transfer Object for User Registration
 *
 * This DTO handles incoming registration requests from the frontend:
 * - Validates all required fields using Bean Validation
 * - Provides security by only accepting necessary registration data
 * - Maps perfectly to the User entity for easy conversion
 * - Includes custom validation messages for better user experience
 * - Prevents over-posting attacks by limiting exposed fields
 */
public class RegisterRequest {

    // ✅ FIRST NAME FIELD with comprehensive validation
    @NotNull(message = "First name is required")
    @NotBlank(message = "First name cannot be empty")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'-]+$", message = "First name can only contain letters, spaces, hyphens, and apostrophes")
    @JsonProperty("firstName")
    private String firstName;

    // ✅ LAST NAME FIELD with comprehensive validation
    @NotNull(message = "Last name is required")
    @NotBlank(message = "Last name cannot be empty")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s'-]+$", message = "Last name can only contain letters, spaces, hyphens, and apostrophes")
    @JsonProperty("lastName")
    private String lastName;

    // ✅ EMAIL FIELD with professional validation
    @NotNull(message = "Email address is required")
    @NotBlank(message = "Email address cannot be empty")
    @Email(message = "Please enter a valid email address")
    @Size(max = 255, message = "Email address is too long (maximum 255 characters)")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Email format is invalid")
    @JsonProperty("email")
    private String email;

    // ✅ PASSWORD FIELD with security validation
    @NotNull(message = "Password is required")
    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    @JsonProperty("password")
    private String password;

    // ✅ DEFAULT CONSTRUCTOR (required by Jackson and Spring)
    public RegisterRequest() {
    }

    // ✅ PARAMETERIZED CONSTRUCTOR for easy object creation
    public RegisterRequest(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    // ✅ GETTERS AND SETTERS with proper encapsulation
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

    // ✅ UTILITY METHODS for enhanced functionality

    /**
     * Get full name by combining first and last name
     * @return full name as "firstName lastName"
     */
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

    /**
     * Check if all required fields are present (additional validation)
     * @return true if all required fields are not null and not empty
     */
    public boolean hasAllRequiredFields() {
        return firstName != null && !firstName.trim().isEmpty() &&
                lastName != null && !lastName.trim().isEmpty() &&
                email != null && !email.trim().isEmpty() &&
                password != null && !password.trim().isEmpty();
    }

    /**
     * Get email domain for analytics/filtering purposes
     * @return domain part of email address (e.g., "gmail.com")
     */
    public String getEmailDomain() {
        if (email == null || !email.contains("@")) {
            return null;
        }
        return email.substring(email.lastIndexOf("@") + 1);
    }

    /**
     * Sanitize and normalize the data before processing
     */
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
        // Note: Password is NOT trimmed to preserve intentional spaces
    }

    // ✅ toString METHOD for debugging (excludes password for security)
    @Override
    public String toString() {
        return "RegisterRequest{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                '}';
    }

    // ✅ equals AND hashCode methods (excludes password for security)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RegisterRequest that = (RegisterRequest) o;

        if (firstName != null ? !firstName.equals(that.firstName) : that.firstName != null) return false;
        if (lastName != null ? !lastName.equals(that.lastName) : that.lastName != null) return false;
        return email != null ? email.equals(that.email) : that.email == null;
    }

    @Override
    public int hashCode() {
        int result = firstName != null ? firstName.hashCode() : 0;
        result = 31 * result + (lastName != null ? lastName.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        return result;
    }
}
