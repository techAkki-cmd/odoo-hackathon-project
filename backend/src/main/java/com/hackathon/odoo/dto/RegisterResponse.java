package com.hackathon.odoo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

/**
 * RegisterResponse DTO - Data Transfer Object for Registration Success Response
 *
 * This DTO provides a structured response for successful user registrations:
 * - Type-safe response with proper field validation
 * - Consistent API response format across all endpoints
 * - Excludes sensitive information (passwords, tokens) for security
 * - Includes helpful information for frontend processing
 * - Perfect complement to RegisterRequest DTO
 *
 * @author Odoo Hackathon Team
 * @version 1.0
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegisterResponse {

    @JsonProperty("success")
    private boolean success;

    @JsonProperty("message")
    private String message;

    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("email")
    private String email;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("fullName")
    private String fullName;

    @JsonProperty("emailVerified")
    private boolean emailVerified;

    @JsonProperty("accountEnabled")
    private boolean accountEnabled;

    @JsonProperty("verificationEmailSent")
    private boolean verificationEmailSent;

    @JsonProperty("verificationRequired")
    private boolean verificationRequired;

    @JsonProperty("timestamp")
    private LocalDateTime timestamp;

    @JsonProperty("nextSteps")
    private NextSteps nextSteps;

    // ✅ DEFAULT CONSTRUCTOR
    public RegisterResponse() {
        this.success = true;
        this.timestamp = LocalDateTime.now();
        this.verificationRequired = true;
        this.verificationEmailSent = true;
        this.emailVerified = false;
        this.accountEnabled = false;
    }

    // ✅ SUCCESS CONSTRUCTOR
    public RegisterResponse(String message, Long userId, String email) {
        this();
        this.message = message;
        this.userId = userId;
        this.email = email;
    }

    // ✅ COMPLETE CONSTRUCTOR
    public RegisterResponse(String message, Long userId, String email, String firstName, String lastName) {
        this(message, userId, email);
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + " " + lastName;
    }

    // ✅ GETTERS AND SETTERS
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
        updateFullName();
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
        updateFullName();
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public boolean isAccountEnabled() {
        return accountEnabled;
    }

    public void setAccountEnabled(boolean accountEnabled) {
        this.accountEnabled = accountEnabled;
    }

    public boolean isVerificationEmailSent() {
        return verificationEmailSent;
    }

    public void setVerificationEmailSent(boolean verificationEmailSent) {
        this.verificationEmailSent = verificationEmailSent;
    }

    public boolean isVerificationRequired() {
        return verificationRequired;
    }

    public void setVerificationRequired(boolean verificationRequired) {
        this.verificationRequired = verificationRequired;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public NextSteps getNextSteps() {
        return nextSteps;
    }

    public void setNextSteps(NextSteps nextSteps) {
        this.nextSteps = nextSteps;
    }

    // ✅ UTILITY METHODS

    /**
     * Update full name when first or last name changes
     */
    private void updateFullName() {
        if (firstName != null && lastName != null) {
            this.fullName = firstName + " " + lastName;
        } else if (firstName != null) {
            this.fullName = firstName;
        } else if (lastName != null) {
            this.fullName = lastName;
        }
    }

    /**
     * Create a success response with next steps
     */
    public static RegisterResponse success(String message, Long userId, String email, String firstName, String lastName) {
        RegisterResponse response = new RegisterResponse(message, userId, email, firstName, lastName);
        response.setNextSteps(NextSteps.createEmailVerificationSteps(email));
        return response;
    }

    /**
     * Create a response from User entity
     */
    public static RegisterResponse fromUser(String message, com.hackathon.odoo.entity.User user) {
        RegisterResponse response = new RegisterResponse(message, user.getId(), user.getEmail(), user.getFirstName(), user.getLastName());
        response.setEmailVerified(user.isEmailVerified());
        response.setAccountEnabled(user.isEnabled());
        response.setNextSteps(NextSteps.createEmailVerificationSteps(user.getEmail()));
        return response;
    }

    // ✅ toString FOR DEBUGGING (excludes sensitive information)
    @Override
    public String toString() {
        return "RegisterResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", userId=" + userId +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", emailVerified=" + emailVerified +
                ", accountEnabled=" + accountEnabled +
                ", timestamp=" + timestamp +
                '}';
    }

    // ✅ INNER CLASS FOR NEXT STEPS
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class NextSteps {

        @JsonProperty("checkEmail")
        private String checkEmail;

        @JsonProperty("verificationInstructions")
        private String verificationInstructions;

        @JsonProperty("troubleshooting")
        private TroubleshootingInfo troubleshooting;

        @JsonProperty("supportContact")
        private String supportContact;

        @JsonProperty("estimatedDeliveryTime")
        private String estimatedDeliveryTime;

        // Constructors
        public NextSteps() {}

        public NextSteps(String checkEmail, String verificationInstructions) {
            this.checkEmail = checkEmail;
            this.verificationInstructions = verificationInstructions;
            this.estimatedDeliveryTime = "2-5 minutes";
            this.supportContact = "support@odoohackathon.com";
        }

        // Static factory method
        public static NextSteps createEmailVerificationSteps(String email) {
            NextSteps steps = new NextSteps(
                    "Please check your email inbox at: " + email,
                    "Click the verification link in the email to activate your account."
            );
            steps.setTroubleshooting(TroubleshootingInfo.createEmailTroubleshooting());
            return steps;
        }

        // Getters and Setters
        public String getCheckEmail() { return checkEmail; }
        public void setCheckEmail(String checkEmail) { this.checkEmail = checkEmail; }

        public String getVerificationInstructions() { return verificationInstructions; }
        public void setVerificationInstructions(String verificationInstructions) { this.verificationInstructions = verificationInstructions; }

        public TroubleshootingInfo getTroubleshooting() { return troubleshooting; }
        public void setTroubleshooting(TroubleshootingInfo troubleshooting) { this.troubleshooting = troubleshooting; }

        public String getSupportContact() { return supportContact; }
        public void setSupportContact(String supportContact) { this.supportContact = supportContact; }

        public String getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
        public void setEstimatedDeliveryTime(String estimatedDeliveryTime) { this.estimatedDeliveryTime = estimatedDeliveryTime; }
    }

    // ✅ INNER CLASS FOR TROUBLESHOOTING
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TroubleshootingInfo {

        @JsonProperty("commonIssues")
        private String[] commonIssues;

        @JsonProperty("checkSpamFolder")
        private boolean checkSpamFolder;

        @JsonProperty("resendAvailable")
        private boolean resendAvailable;

        @JsonProperty("helpfulTips")
        private String[] helpfulTips;

        // Constructor
        public TroubleshootingInfo() {
            this.checkSpamFolder = true;
            this.resendAvailable = true;
        }

        // Static factory method
        public static TroubleshootingInfo createEmailTroubleshooting() {
            TroubleshootingInfo info = new TroubleshootingInfo();
            info.setCommonIssues(new String[]{
                    "Check your spam/junk folder",
                    "Verify email address spelling",
                    "Wait up to 5 minutes for delivery",
                    "Check promotions tab (Gmail users)"
            });
            info.setHelpfulTips(new String[]{
                    "Add noreply@odoohackathon.com to your contacts",
                    "Check all email folders including promotions",
                    "Use resend option if email doesn't arrive"
            });
            return info;
        }

        // Getters and Setters
        public String[] getCommonIssues() { return commonIssues; }
        public void setCommonIssues(String[] commonIssues) { this.commonIssues = commonIssues; }

        public boolean isCheckSpamFolder() { return checkSpamFolder; }
        public void setCheckSpamFolder(boolean checkSpamFolder) { this.checkSpamFolder = checkSpamFolder; }

        public boolean isResendAvailable() { return resendAvailable; }
        public void setResendAvailable(boolean resendAvailable) { this.resendAvailable = resendAvailable; }

        public String[] getHelpfulTips() { return helpfulTips; }
        public void setHelpfulTips(String[] helpfulTips) { this.helpfulTips = helpfulTips; }
    }
}
