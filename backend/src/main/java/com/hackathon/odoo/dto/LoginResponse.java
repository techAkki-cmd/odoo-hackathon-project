package com.hackathon.odoo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

/**
 * LoginResponse DTO - Data Transfer Object for Login Success/Failure Response
 *
 * This DTO provides a structured response for user login attempts:
 * - Type-safe response with proper field validation
 * - Consistent API response format across all endpoints
 * - Excludes sensitive information (passwords, tokens) for security
 * - Includes session information and user preferences
 * - Perfect complement to LoginRequest DTO
 * - Provides clear next steps for successful authentication
 *
 * @author Odoo Hackathon Team
 * @version 1.0
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {

    @JsonProperty("success")
    private boolean success;

    @JsonProperty("message")
    private String message;

    @JsonProperty("user")
    private UserInfo user;

    @JsonProperty("session")
    private SessionInfo session;

    @JsonProperty("rememberMe")
    private boolean rememberMe;

    @JsonProperty("timestamp")
    private LocalDateTime timestamp;

    @JsonProperty("redirectUrl")
    private String redirectUrl;

    @JsonProperty("nextSteps")
    private NextSteps nextSteps;

    // For error responses
    @JsonProperty("email")
    private String email;

    @JsonProperty("errorCode")
    private String errorCode;

    @JsonProperty("canRetry")
    private Boolean canRetry;

    @JsonProperty("lockoutInfo")
    private LockoutInfo lockoutInfo;

    // ✅ DEFAULT CONSTRUCTOR
    public LoginResponse() {
        this.success = true;
        this.timestamp = LocalDateTime.now();
        this.rememberMe = false;
        this.canRetry = true;
        this.redirectUrl = "/dashboard";
    }

    // ✅ SUCCESS CONSTRUCTOR
    public LoginResponse(String message, UserInfo user) {
        this();
        this.message = message;
        this.user = user;
    }

    // ✅ ERROR CONSTRUCTOR
    public LoginResponse(boolean success, String message, String errorCode) {
        this();
        this.success = success;
        this.message = message;
        this.errorCode = errorCode;
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

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public SessionInfo getSession() {
        return session;
    }

    public void setSession(SessionInfo session) {
        this.session = session;
    }

    public boolean isRememberMe() {
        return rememberMe;
    }

    public void setRememberMe(boolean rememberMe) {
        this.rememberMe = rememberMe;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public NextSteps getNextSteps() {
        return nextSteps;
    }

    public void setNextSteps(NextSteps nextSteps) {
        this.nextSteps = nextSteps;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public Boolean getCanRetry() {
        return canRetry;
    }

    public void setCanRetry(Boolean canRetry) {
        this.canRetry = canRetry;
    }

    public LockoutInfo getLockoutInfo() {
        return lockoutInfo;
    }

    public void setLockoutInfo(LockoutInfo lockoutInfo) {
        this.lockoutInfo = lockoutInfo;
    }

    // ✅ STATIC FACTORY METHODS

    /**
     * Create a success response from User entity
     */
    public static LoginResponse fromUser(String message, com.hackathon.odoo.entity.User user) {
        LoginResponse response = new LoginResponse();
        response.setMessage(message);
        response.setUser(UserInfo.fromUser(user));
        response.setSession(SessionInfo.createNewSession());
        response.setNextSteps(NextSteps.createPostLoginSteps());
        return response;
    }

    /**
     * Create an error response
     */
    public static LoginResponse error(String message, String errorCode) {
        LoginResponse response = new LoginResponse(false, message, errorCode);
        response.setNextSteps(NextSteps.createErrorRecoverySteps(errorCode));
        return response;
    }

    /**
     * Create an error response with lockout information
     */
    public static LoginResponse errorWithLockout(String message, String errorCode, int remainingMinutes) {
        LoginResponse response = error(message, errorCode);
        response.setCanRetry(false);
        response.setLockoutInfo(new LockoutInfo(remainingMinutes));
        return response;
    }

    // ✅ toString FOR DEBUGGING (excludes sensitive information)
    @Override
    public String toString() {
        return "LoginResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", userEmail='" + (user != null ? user.getEmail() : "null") + '\'' +
                ", rememberMe=" + rememberMe +
                ", timestamp=" + timestamp +
                '}';
    }

    // ✅ INNER CLASS FOR USER INFORMATION
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UserInfo {

        @JsonProperty("id")
        private Long id;

        @JsonProperty("firstName")
        private String firstName;

        @JsonProperty("lastName")
        private String lastName;

        @JsonProperty("fullName")
        private String fullName;

        @JsonProperty("email")
        private String email;

        @JsonProperty("emailVerified")
        private boolean emailVerified;

        @JsonProperty("isProfilePublic")
        private boolean isProfilePublic;

        @JsonProperty("accountEnabled")
        private boolean accountEnabled;

        @JsonProperty("memberSince")
        private LocalDateTime memberSince;

        @JsonProperty("lastLogin")
        private LocalDateTime lastLogin;

        // Constructors
        public UserInfo() {}

        // Static factory method
        public static UserInfo fromUser(com.hackathon.odoo.entity.User user) {
            UserInfo userInfo = new UserInfo();
            userInfo.setId(user.getId());
            userInfo.setFirstName(user.getFirstName());
            userInfo.setLastName(user.getLastName());
            userInfo.setFullName(user.getFullName());
            userInfo.setEmail(user.getEmail());
            userInfo.setEmailVerified(user.isEmailVerified());
            userInfo.setProfilePublic(user.isProfilePublic());
            userInfo.setAccountEnabled(user.isEnabled());
            userInfo.setMemberSince(user.getCreatedAt());
            userInfo.setLastLogin(LocalDateTime.now());
            return userInfo;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public boolean isEmailVerified() { return emailVerified; }
        public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

        public boolean isProfilePublic() { return isProfilePublic; }
        public void setProfilePublic(boolean profilePublic) { isProfilePublic = profilePublic; }

        public boolean isAccountEnabled() { return accountEnabled; }
        public void setAccountEnabled(boolean accountEnabled) { this.accountEnabled = accountEnabled; }

        public LocalDateTime getMemberSince() { return memberSince; }
        public void setMemberSince(LocalDateTime memberSince) { this.memberSince = memberSince; }

        public LocalDateTime getLastLogin() { return lastLogin; }
        public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    }

    // ✅ INNER CLASS FOR SESSION INFORMATION
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SessionInfo {

        @JsonProperty("sessionId")
        private String sessionId;

        @JsonProperty("expiresAt")
        private LocalDateTime expiresAt;

        @JsonProperty("tokenType")
        private String tokenType;

        @JsonProperty("refreshToken")
        private String refreshToken;

        @JsonProperty("sessionTimeout")
        private int sessionTimeoutMinutes;

        // Constructor
        public SessionInfo() {
            this.tokenType = "Bearer";
            this.sessionTimeoutMinutes = 480; // 8 hours default
        }

        // Static factory method
        public static SessionInfo createNewSession() {
            SessionInfo session = new SessionInfo();
            session.setSessionId(java.util.UUID.randomUUID().toString());
            session.setExpiresAt(LocalDateTime.now().plusMinutes(session.getSessionTimeoutMinutes()));
            return session;
        }

        // Getters and Setters
        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }

        public LocalDateTime getExpiresAt() { return expiresAt; }
        public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

        public String getTokenType() { return tokenType; }
        public void setTokenType(String tokenType) { this.tokenType = tokenType; }

        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

        public int getSessionTimeoutMinutes() { return sessionTimeoutMinutes; }
        public void setSessionTimeoutMinutes(int sessionTimeoutMinutes) { this.sessionTimeoutMinutes = sessionTimeoutMinutes; }
    }

    // ✅ INNER CLASS FOR NEXT STEPS
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class NextSteps {

        @JsonProperty("welcomeMessage")
        private String welcomeMessage;

        @JsonProperty("recommendedActions")
        private String[] recommendedActions;

        @JsonProperty("dashboardUrl")
        private String dashboardUrl;

        @JsonProperty("profileCompletion")
        private ProfileCompletion profileCompletion;

        // Constructor
        public NextSteps() {}

        // Static factory methods
        public static NextSteps createPostLoginSteps() {
            NextSteps steps = new NextSteps();
            steps.setWelcomeMessage("Welcome to your Odoo Hackathon dashboard!");
            steps.setRecommendedActions(new String[]{
                    "Complete your profile setup",
                    "Explore hackathon challenges",
                    "Join team discussions",
                    "Submit your first project"
            });
            steps.setDashboardUrl("/dashboard");
            steps.setProfileCompletion(new ProfileCompletion(75, "Consider adding a profile picture and bio"));
            return steps;
        }

        public static NextSteps createErrorRecoverySteps(String errorCode) {
            NextSteps steps = new NextSteps();

            switch (errorCode) {
                case "AUTHENTICATION_FAILED":
                    steps.setRecommendedActions(new String[]{
                            "Double-check your email address",
                            "Verify your password is correct",
                            "Try resetting your password if needed"
                    });
                    break;
                case "ACCOUNT_NOT_VERIFIED":
                    steps.setRecommendedActions(new String[]{
                            "Check your email for verification link",
                            "Resend verification email if needed",
                            "Check spam/junk folders"
                    });
                    break;
                case "ACCOUNT_LOCKED":
                    steps.setRecommendedActions(new String[]{
                            "Wait for the lockout period to expire",
                            "Contact support if this persists",
                            "Try resetting your password"
                    });
                    break;
                default:
                    steps.setRecommendedActions(new String[]{
                            "Try again in a few moments",
                            "Check your internet connection",
                            "Contact support if problem persists"
                    });
            }

            return steps;
        }

        // Getters and Setters
        public String getWelcomeMessage() { return welcomeMessage; }
        public void setWelcomeMessage(String welcomeMessage) { this.welcomeMessage = welcomeMessage; }

        public String[] getRecommendedActions() { return recommendedActions; }
        public void setRecommendedActions(String[] recommendedActions) { this.recommendedActions = recommendedActions; }

        public String getDashboardUrl() { return dashboardUrl; }
        public void setDashboardUrl(String dashboardUrl) { this.dashboardUrl = dashboardUrl; }

        public ProfileCompletion getProfileCompletion() { return profileCompletion; }
        public void setProfileCompletion(ProfileCompletion profileCompletion) { this.profileCompletion = profileCompletion; }
    }

    // ✅ INNER CLASS FOR PROFILE COMPLETION
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ProfileCompletion {

        @JsonProperty("percentage")
        private int percentage;

        @JsonProperty("suggestion")
        private String suggestion;

        @JsonProperty("missingFields")
        private String[] missingFields;

        // Constructor
        public ProfileCompletion() {}

        public ProfileCompletion(int percentage, String suggestion) {
            this.percentage = percentage;
            this.suggestion = suggestion;
        }

        // Getters and Setters
        public int getPercentage() { return percentage; }
        public void setPercentage(int percentage) { this.percentage = percentage; }

        public String getSuggestion() { return suggestion; }
        public void setSuggestion(String suggestion) { this.suggestion = suggestion; }

        public String[] getMissingFields() { return missingFields; }
        public void setMissingFields(String[] missingFields) { this.missingFields = missingFields; }
    }

    // ✅ INNER CLASS FOR LOCKOUT INFORMATION
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class LockoutInfo {

        @JsonProperty("isLocked")
        private boolean isLocked;

        @JsonProperty("remainingMinutes")
        private int remainingMinutes;

        @JsonProperty("unlockTime")
        private LocalDateTime unlockTime;

        @JsonProperty("reason")
        private String reason;

        // Constructor
        public LockoutInfo() {}

        public LockoutInfo(int remainingMinutes) {
            this.isLocked = true;
            this.remainingMinutes = remainingMinutes;
            this.unlockTime = LocalDateTime.now().plusMinutes(remainingMinutes);
            this.reason = "Too many failed login attempts";
        }

        // Getters and Setters
        public boolean isLocked() { return isLocked; }
        public void setLocked(boolean locked) { isLocked = locked; }

        public int getRemainingMinutes() { return remainingMinutes; }
        public void setRemainingMinutes(int remainingMinutes) { this.remainingMinutes = remainingMinutes; }

        public LocalDateTime getUnlockTime() { return unlockTime; }
        public void setUnlockTime(LocalDateTime unlockTime) { this.unlockTime = unlockTime; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
