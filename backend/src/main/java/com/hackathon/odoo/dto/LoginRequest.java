package com.hackathon.odoo.dto;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * LoginRequest DTO - Data Transfer Object for User Login
 *
 * This DTO handles incoming login requests from the frontend:
 * - Validates email and password fields using Bean Validation
 * - Provides security by only accepting necessary login data
 * - Maps perfectly to the AuthService authentication methods
 * - Includes optional fields for enhanced user experience
 * - Prevents over-posting attacks by limiting exposed fields
 * - Perfect complement to RegisterRequest DTO
 *
 * @author Odoo Hackathon Team
 * @version 1.0
 */
public class LoginRequest {

    // ✅ EMAIL FIELD with comprehensive validation
    @NotNull(message = "Email address is required")
    @NotBlank(message = "Email address cannot be empty")
    @Email(message = "Please enter a valid email address")
    @Size(max = 255, message = "Email address is too long (maximum 255 characters)")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Email format is invalid")
    @JsonProperty("email")
    private String email;

    // ✅ PASSWORD FIELD with basic validation
    @NotNull(message = "Password is required")
    @NotBlank(message = "Password cannot be empty")
    @Size(min = 1, max = 128, message = "Password length is invalid")
    @JsonProperty("password")
    private String password;

    // ✅ REMEMBER ME FIELD (optional)
    @JsonProperty("rememberMe")
    private Boolean rememberMe = false;

    // ✅ DEVICE INFO FIELDS (optional for security tracking)
    @JsonProperty("deviceInfo")
    private String deviceInfo;

    @JsonProperty("userAgent")
    private String userAgent;

    @JsonProperty("ipAddress")
    private String ipAddress;

    // ✅ DEFAULT CONSTRUCTOR (required by Jackson and Spring)
    public LoginRequest() {
    }

    // ✅ BASIC CONSTRUCTOR for essential fields
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
        this.rememberMe = false;
    }

    // ✅ FULL CONSTRUCTOR with all fields
    public LoginRequest(String email, String password, Boolean rememberMe) {
        this.email = email;
        this.password = password;
        this.rememberMe = rememberMe != null ? rememberMe : false;
    }

    // ✅ GETTERS AND SETTERS with proper encapsulation
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

    public Boolean getRememberMe() {
        return rememberMe;
    }

    public void setRememberMe(Boolean rememberMe) {
        this.rememberMe = rememberMe != null ? rememberMe : false;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo != null ? deviceInfo.trim() : null;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent != null ? userAgent.trim() : null;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress != null ? ipAddress.trim() : null;
    }

    // ✅ UTILITY METHODS for enhanced functionality

    /**
     * Check if all required fields are present (additional validation)
     * @return true if email and password are not null and not empty
     */
    public boolean hasValidCredentials() {
        return email != null && !email.trim().isEmpty() &&
                password != null && !password.trim().isEmpty();
    }

    /**
     * Get email domain for analytics/security purposes
     * @return domain part of email address (e.g., "gmail.com")
     */
    public String getEmailDomain() {
        if (email == null || !email.contains("@")) {
            return null;
        }
        return email.substring(email.lastIndexOf("@") + 1);
    }

    /**
     * Check if this is a remember me login
     * @return true if remember me is enabled
     */
    public boolean isRememberMeLogin() {
        return rememberMe != null && rememberMe;
    }

    /**
     * Sanitize and normalize the data before processing
     */
    public void sanitize() {
        if (email != null) {
            email = email.trim().toLowerCase();
        }
        // Note: Password is NOT trimmed to preserve intentional spaces
        if (deviceInfo != null) {
            deviceInfo = deviceInfo.trim();
        }
        if (userAgent != null) {
            userAgent = userAgent.trim();
        }
        if (ipAddress != null) {
            ipAddress = ipAddress.trim();
        }
    }

    /**
     * Check if device information is provided
     * @return true if any device info is available
     */
    public boolean hasDeviceInfo() {
        return (deviceInfo != null && !deviceInfo.trim().isEmpty()) ||
                (userAgent != null && !userAgent.trim().isEmpty()) ||
                (ipAddress != null && !ipAddress.trim().isEmpty());
    }

    // ✅ toString METHOD for debugging (excludes password for security)
    @Override
    public String toString() {
        return "LoginRequest{" +
                "email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                ", rememberMe=" + rememberMe +
                ", hasDeviceInfo=" + hasDeviceInfo() +
                '}';
    }

    // ✅ equals AND hashCode methods (excludes password for security)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LoginRequest that = (LoginRequest) o;

        if (email != null ? !email.equals(that.email) : that.email != null) return false;
        return rememberMe != null ? rememberMe.equals(that.rememberMe) : that.rememberMe == null;
    }

    @Override
    public int hashCode() {
        int result = email != null ? email.hashCode() : 0;
        result = 31 * result + (rememberMe != null ? rememberMe.hashCode() : 0);
        return result;
    }
}
