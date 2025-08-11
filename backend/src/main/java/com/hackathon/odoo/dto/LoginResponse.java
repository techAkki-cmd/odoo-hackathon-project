package com.hackathon.odoo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.hackathon.odoo.entity.User;
import java.time.LocalDateTime;

/**
 * LoginResponse DTO - Enhanced for Rental Management Platform
 *
 * This DTO provides structured responses for user login attempts with:
 * - Role-based authentication information (Customer, Owner, Business, Admin)
 * - Location and business information for property owners
 * - Role-specific redirects and next steps
 * - Platform features available to each user type
 * - Enhanced security with lockout information
 * - Perfect integration with rental management frontend
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {

    // ✅ EXISTING CORE FIELDS (keep all your current ones)
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

    // Error response fields
    @JsonProperty("email")
    private String email;

    @JsonProperty("errorCode")
    private String errorCode;

    @JsonProperty("canRetry")
    private Boolean canRetry;

    @JsonProperty("lockoutInfo")
    private LockoutInfo lockoutInfo;

    // ✅ NEW: RENTAL MANAGEMENT SPECIFIC FIELDS
    @JsonProperty("platformStats")
    private PlatformStats platformStats;

    @JsonProperty("dashboardPreferences")
    private DashboardPreferences dashboardPreferences;

    // ✅ CONSTRUCTORS (keep your existing ones)
    public LoginResponse() {
        this.success = true;
        this.timestamp = LocalDateTime.now();
        this.rememberMe = false;
        this.canRetry = true;
        this.redirectUrl = "/dashboard";
    }

    public LoginResponse(String message, UserInfo user) {
        this();
        this.message = message;
        this.user = user;
    }

    public LoginResponse(boolean success, String message, String errorCode) {
        this();
        this.success = success;
        this.message = message;
        this.errorCode = errorCode;
    }

    // ✅ GETTERS AND SETTERS (keep all your existing ones + new ones)

    // [Keep all your existing getters/setters exactly as they are]
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserInfo getUser() { return user; }
    public void setUser(UserInfo user) { this.user = user; }

    public SessionInfo getSession() { return session; }
    public void setSession(SessionInfo session) { this.session = session; }

    public boolean isRememberMe() { return rememberMe; }
    public void setRememberMe(boolean rememberMe) { this.rememberMe = rememberMe; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getRedirectUrl() { return redirectUrl; }
    public void setRedirectUrl(String redirectUrl) { this.redirectUrl = redirectUrl; }

    public NextSteps getNextSteps() { return nextSteps; }
    public void setNextSteps(NextSteps nextSteps) { this.nextSteps = nextSteps; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public Boolean getCanRetry() { return canRetry; }
    public void setCanRetry(Boolean canRetry) { this.canRetry = canRetry; }

    public LockoutInfo getLockoutInfo() { return lockoutInfo; }
    public void setLockoutInfo(LockoutInfo lockoutInfo) { this.lockoutInfo = lockoutInfo; }

    // ✅ NEW: RENTAL MANAGEMENT GETTERS AND SETTERS
    public PlatformStats getPlatformStats() { return platformStats; }
    public void setPlatformStats(PlatformStats platformStats) { this.platformStats = platformStats; }

    public DashboardPreferences getDashboardPreferences() { return dashboardPreferences; }
    public void setDashboardPreferences(DashboardPreferences dashboardPreferences) { this.dashboardPreferences = dashboardPreferences; }

    // ✅ ENHANCED STATIC FACTORY METHODS
    public static LoginResponse fromUser(String message, User user) {
        LoginResponse response = new LoginResponse();
        response.setMessage(message);
        response.setUser(UserInfo.fromUser(user));
        response.setSession(SessionInfo.createNewSession());

        // ✅ Role-based redirect URL
        response.setRedirectUrl(getRoleBasedRedirectUrl(user.getUserRole()));

        // ✅ Role-based next steps
        response.setNextSteps(NextSteps.createRoleBasedPostLoginSteps(user));

        // ✅ Platform statistics for user
        response.setPlatformStats(PlatformStats.createForUser(user));

        // ✅ Dashboard preferences
        response.setDashboardPreferences(DashboardPreferences.createForRole(user.getUserRole()));

        return response;
    }

    public static LoginResponse error(String message, String errorCode) {
        LoginResponse response = new LoginResponse(false, message, errorCode);
        response.setNextSteps(NextSteps.createErrorRecoverySteps(errorCode));
        return response;
    }

    public static LoginResponse errorWithLockout(String message, String errorCode, int remainingMinutes) {
        LoginResponse response = error(message, errorCode);
        response.setCanRetry(false);
        response.setLockoutInfo(new LockoutInfo(remainingMinutes));
        return response;
    }

    // ✅ HELPER METHOD FOR ROLE-BASED REDIRECTS
    private static String getRoleBasedRedirectUrl(User.UserRole role) {
        return switch (role) {
            case CUSTOMER -> "/customer-dashboard";
            case OWNER -> "/owner-dashboard";
            case BUSINESS -> "/business-dashboard";
            case ADMIN -> "/admin-dashboard";
            case SUPER_ADMIN -> "/super-admin-dashboard";
            default -> "/dashboard";
        };
    }

    // ✅ toString FOR DEBUGGING (keep your existing one)
    @Override
    public String toString() {
        return "LoginResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", userEmail='" + (user != null ? user.getEmail() : "null") + '\'' +
                ", userRole='" + (user != null ? user.getRole() : "null") + '\'' +
                ", rememberMe=" + rememberMe +
                ", timestamp=" + timestamp +
                '}';
    }

    // ✅ ENHANCED USER INFO CLASS
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UserInfo {

        // Existing fields (keep all your current ones)
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

        @JsonProperty("accountEnabled")
        private boolean accountEnabled;

        @JsonProperty("memberSince")
        private LocalDateTime memberSince;

        @JsonProperty("lastLogin")
        private LocalDateTime lastLogin;

        // ✅ NEW: RENTAL MANAGEMENT SPECIFIC FIELDS
        @JsonProperty("role")
        private User.UserRole role;

        @JsonProperty("location")
        private String location;

        @JsonProperty("isBusinessUser")
        private boolean isBusinessUser;

        @JsonProperty("businessName")
        private String businessName;

        @JsonProperty("businessType")
        private User.BusinessType businessType;

        @JsonProperty("hasBusinessInfo")
        private boolean hasBusinessInfo;

        @JsonProperty("totalRentals")
        private Integer totalRentals;

        @JsonProperty("averageRating")
        private Double averageRating;

        @JsonProperty("profilePhotoUrl")
        private String profilePhotoUrl;

        public UserInfo() {}

        // ✅ ENHANCED FACTORY METHOD
        public static UserInfo fromUser(User user) {
            UserInfo userInfo = new UserInfo();

            // Existing fields
            userInfo.setId(user.getId());
            userInfo.setFirstName(user.getFirstName());
            userInfo.setLastName(user.getLastName());
            userInfo.setFullName(user.getFullName());
            userInfo.setEmail(user.getEmail());
            userInfo.setEmailVerified(user.isEmailVerified());
            userInfo.setAccountEnabled(user.isEnabled());
            userInfo.setMemberSince(user.getCreatedAt());
            userInfo.setLastLogin(user.getLastLoginTime());

            // ✅ NEW: Rental management fields
            userInfo.setRole(user.getUserRole());
            userInfo.setLocation(user.getLocation());
            userInfo.setBusinessUser(user.isBusinessUser());
            userInfo.setBusinessName(user.getBusinessName());
            userInfo.setBusinessType(user.getBusinessType());
            userInfo.setHasBusinessInfo(user.hasBusinessInfo());
            userInfo.setTotalRentals(user.getTotalRentals());
            userInfo.setAverageRating(user.getAverageRating());
            userInfo.setProfilePhotoUrl(user.getProfilePhotoUrl());

            return userInfo;
        }

        public String getDisplayName() {
            if (hasBusinessInfo && businessName != null && !businessName.trim().isEmpty()) {
                return businessName;
            }
            return fullName;
        }

        // ✅ GETTERS AND SETTERS (keep existing + add new ones)
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

        public boolean isAccountEnabled() { return accountEnabled; }
        public void setAccountEnabled(boolean accountEnabled) { this.accountEnabled = accountEnabled; }

        public LocalDateTime getMemberSince() { return memberSince; }
        public void setMemberSince(LocalDateTime memberSince) { this.memberSince = memberSince; }

        public LocalDateTime getLastLogin() { return lastLogin; }
        public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

        // New getters/setters
        public User.UserRole getRole() { return role; }
        public void setRole(User.UserRole role) { this.role = role; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public boolean isBusinessUser() { return isBusinessUser; }
        public void setBusinessUser(boolean businessUser) { this.isBusinessUser = businessUser; }

        public String getBusinessName() { return businessName; }
        public void setBusinessName(String businessName) { this.businessName = businessName; }

        public User.BusinessType getBusinessType() { return businessType; }
        public void setBusinessType(User.BusinessType businessType) { this.businessType = businessType; }

        public boolean isHasBusinessInfo() { return hasBusinessInfo; }
        public void setHasBusinessInfo(boolean hasBusinessInfo) { this.hasBusinessInfo = hasBusinessInfo; }

        public Integer getTotalRentals() { return totalRentals; }
        public void setTotalRentals(Integer totalRentals) { this.totalRentals = totalRentals; }

        public Double getAverageRating() { return averageRating; }
        public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

        public String getProfilePhotoUrl() { return profilePhotoUrl; }
        public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }
    }

    // ✅ ENHANCED SESSION INFO CLASS (keep your existing implementation)
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

        @JsonProperty("sessionTimeoutMinutes")
        private int sessionTimeoutMinutes;

        public SessionInfo() {
            this.tokenType = "Bearer";
            this.sessionTimeoutMinutes = 480; // 8 hours default
        }

        public static SessionInfo createNewSession() {
            SessionInfo session = new SessionInfo();
            session.setSessionId(java.util.UUID.randomUUID().toString());
            session.setExpiresAt(LocalDateTime.now().plusMinutes(session.getSessionTimeoutMinutes()));
            session.setRefreshToken(java.util.UUID.randomUUID().toString());
            return session;
        }

        // Getters and Setters (keep your existing ones)
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

    // ✅ ENHANCED NEXT STEPS CLASS
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

        public NextSteps() {}

        // ✅ ROLE-BASED FACTORY METHOD
        public static NextSteps createRoleBasedPostLoginSteps(User user) {
            NextSteps steps = new NextSteps();
            steps.setWelcomeMessage(getRoleWelcomeMessage(user));
            steps.setRecommendedActions(getRoleRecommendedActions(user.getUserRole()));
            steps.setDashboardUrl(getRoleBasedRedirectUrl(user.getUserRole()));
            steps.setProfileCompletion(ProfileCompletion.calculateForUser(user));
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

        private static String getRoleWelcomeMessage(User user) {
            String displayName = user.hasBusinessInfo() ? user.getBusinessName() : user.getFirstName();

            return switch (user.getUserRole()) {
                case CUSTOMER -> "Welcome back, " + displayName + "! Ready to find your next rental?";
                case OWNER -> "Welcome back, " + displayName + "! Check your property bookings and earnings.";
                case BUSINESS -> "Welcome back to " + displayName + "! Your business dashboard awaits.";
                case ADMIN -> "Welcome back, " + displayName + "! Monitor the platform from your admin dashboard.";
                default -> "Welcome back to RentHub, " + displayName + "!";
            };
        }

        private static String[] getRoleRecommendedActions(User.UserRole role) {
            return switch (role) {
                case CUSTOMER -> new String[]{
                        "Browse featured rental properties",
                        "Check your upcoming bookings",
                        "Explore new rentals in your area",
                        "Update your preferences"
                };
                case OWNER, BUSINESS -> new String[]{
                        "Review new booking requests",
                        "Check your earnings dashboard",
                        "Update property availability",
                        "Respond to customer messages"
                };
                case ADMIN -> new String[]{
                        "Review platform statistics",
                        "Check pending property approvals",
                        "Monitor user activity",
                        "Review support tickets"
                };
                default -> new String[]{
                        "Complete your profile",
                        "Explore the platform",
                        "Set your preferences"
                };
            };
        }

        // Getters and Setters (keep your existing ones)
        public String getWelcomeMessage() { return welcomeMessage; }
        public void setWelcomeMessage(String welcomeMessage) { this.welcomeMessage = welcomeMessage; }

        public String[] getRecommendedActions() { return recommendedActions; }
        public void setRecommendedActions(String[] recommendedActions) { this.recommendedActions = recommendedActions; }

        public String getDashboardUrl() { return dashboardUrl; }
        public void setDashboardUrl(String dashboardUrl) { this.dashboardUrl = dashboardUrl; }

        public ProfileCompletion getProfileCompletion() { return profileCompletion; }
        public void setProfileCompletion(ProfileCompletion profileCompletion) { this.profileCompletion = profileCompletion; }
    }

    // ✅ ENHANCED PROFILE COMPLETION CLASS
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ProfileCompletion {

        @JsonProperty("percentage")
        private int percentage;

        @JsonProperty("suggestion")
        private String suggestion;

        @JsonProperty("missingFields")
        private String[] missingFields;

        public ProfileCompletion() {}

        public ProfileCompletion(int percentage, String suggestion) {
            this.percentage = percentage;
            this.suggestion = suggestion;
        }

        // ✅ CALCULATE COMPLETION FOR USER
        public static ProfileCompletion calculateForUser(User user) {
            int completionScore = 0;
            java.util.List<String> missing = new java.util.ArrayList<>();

            // Basic profile (40%)
            if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) completionScore += 10;
            else missing.add("First name");

            if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) completionScore += 10;
            else missing.add("Last name");

            if (user.getLocation() != null && !user.getLocation().trim().isEmpty()) completionScore += 20;
            else missing.add("Location");

            // Profile details (30%)
            if (user.getProfilePhotoUrl() != null && !user.getProfilePhotoUrl().trim().isEmpty()) completionScore += 15;
            else missing.add("Profile photo");

            if (user.getBio() != null && !user.getBio().trim().isEmpty()) completionScore += 15;
            else missing.add("Bio/Description");

            // Business info for owners (30%)
            if (user.isBusinessUser()) {
                if (user.getBusinessName() != null && !user.getBusinessName().trim().isEmpty()) completionScore += 15;
                else missing.add("Business name");

                if (user.getBusinessType() != null) completionScore += 15;
                else missing.add("Business type");
            } else {
                completionScore += 30; // Not applicable for customers
            }

            String suggestion = getSuggestionBasedOnCompletion(completionScore, missing);

            ProfileCompletion completion = new ProfileCompletion(completionScore, suggestion);
            completion.setMissingFields(missing.toArray(new String[0]));
            return completion;
        }

        private static String getSuggestionBasedOnCompletion(int score, java.util.List<String> missing) {
            if (score >= 90) return "Your profile looks great! Keep engaging with the platform.";
            if (score >= 70) return "Almost complete! Consider adding " + String.join(", ", missing.subList(0, Math.min(2, missing.size())));
            if (score >= 50) return "Good start! Complete your " + String.join(" and ", missing.subList(0, Math.min(3, missing.size())));
            return "Let's complete your profile to get the best rental experience.";
        }

        // Getters and Setters (keep your existing ones)
        public int getPercentage() { return percentage; }
        public void setPercentage(int percentage) { this.percentage = percentage; }

        public String getSuggestion() { return suggestion; }
        public void setSuggestion(String suggestion) { this.suggestion = suggestion; }

        public String[] getMissingFields() { return missingFields; }
        public void setMissingFields(String[] missingFields) { this.missingFields = missingFields; }
    }

    // ✅ KEEP YOUR EXISTING LOCKOUT INFO CLASS (it's perfect)
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

        public LockoutInfo() {}

        public LockoutInfo(int remainingMinutes) {
            this.isLocked = true;
            this.remainingMinutes = remainingMinutes;
            this.unlockTime = LocalDateTime.now().plusMinutes(remainingMinutes);
            this.reason = "Too many failed login attempts";
        }

        // Getters and Setters (keep your existing ones)
        public boolean isLocked() { return isLocked; }
        public void setLocked(boolean locked) { isLocked = locked; }

        public int getRemainingMinutes() { return remainingMinutes; }
        public void setRemainingMinutes(int remainingMinutes) { this.remainingMinutes = remainingMinutes; }

        public LocalDateTime getUnlockTime() { return unlockTime; }
        public void setUnlockTime(LocalDateTime unlockTime) { this.unlockTime = unlockTime; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }

    // ✅ NEW: PLATFORM STATISTICS CLASS
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PlatformStats {

        @JsonProperty("totalBookings")
        private Integer totalBookings;

        @JsonProperty("savedAmount")
        private String savedAmount;

        @JsonProperty("memberSince")
        private String memberSince;

        @JsonProperty("favoriteProperties")
        private Integer favoriteProperties;

        @JsonProperty("earningsThisMonth")
        private String earningsThisMonth;

        @JsonProperty("activeListings")
        private Integer activeListings;

        public PlatformStats() {}

        public static PlatformStats createForUser(User user) {
            PlatformStats stats = new PlatformStats();

            if (user.getUserRole() == User.UserRole.CUSTOMER) {
                stats.setTotalBookings(user.getTotalRentals());
                stats.setSavedAmount("₹0"); // Calculate from actual data
                stats.setMemberSince(calculateMemberSince(user.getCreatedAt()));
                stats.setFavoriteProperties(0); // Get from actual data
            } else if (user.isBusinessUser()) {
                stats.setActiveListings(0); // Get from actual property count
                stats.setEarningsThisMonth("₹0"); // Calculate from actual earnings
                stats.setTotalBookings(0); // Total bookings received
                stats.setMemberSince(calculateMemberSince(user.getCreatedAt()));
            }

            return stats;
        }

        private static String calculateMemberSince(LocalDateTime createdAt) {
            if (createdAt == null) return "New";

            long days = java.time.Duration.between(createdAt, LocalDateTime.now()).toDays();
            if (days < 30) return "New";
            if (days < 365) return (days / 30) + " months";
            return (days / 365) + " years";
        }

        // Getters and Setters
        public Integer getTotalBookings() { return totalBookings; }
        public void setTotalBookings(Integer totalBookings) { this.totalBookings = totalBookings; }

        public String getSavedAmount() { return savedAmount; }
        public void setSavedAmount(String savedAmount) { this.savedAmount = savedAmount; }

        public String getMemberSince() { return memberSince; }
        public void setMemberSince(String memberSince) { this.memberSince = memberSince; }

        public Integer getFavoriteProperties() { return favoriteProperties; }
        public void setFavoriteProperties(Integer favoriteProperties) { this.favoriteProperties = favoriteProperties; }

        public String getEarningsThisMonth() { return earningsThisMonth; }
        public void setEarningsThisMonth(String earningsThisMonth) { this.earningsThisMonth = earningsThisMonth; }

        public Integer getActiveListings() { return activeListings; }
        public void setActiveListings(Integer activeListings) { this.activeListings = activeListings; }
    }

    // ✅ NEW: DASHBOARD PREFERENCES CLASS
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class DashboardPreferences {

        @JsonProperty("defaultView")
        private String defaultView;

        @JsonProperty("showQuickActions")
        private boolean showQuickActions;

        @JsonProperty("enableNotifications")
        private boolean enableNotifications;

        @JsonProperty("preferredLanguage")
        private String preferredLanguage;

        @JsonProperty("theme")
        private String theme;

        public DashboardPreferences() {
            this.showQuickActions = true;
            this.enableNotifications = true;
            this.preferredLanguage = "en";
            this.theme = "light";
        }

        public static DashboardPreferences createForRole(User.UserRole role) {
            DashboardPreferences prefs = new DashboardPreferences();

            prefs.setDefaultView(switch (role) {
                case CUSTOMER -> "browse-rentals";
                case OWNER, BUSINESS -> "manage-properties";
                case ADMIN -> "platform-overview";
                default -> "dashboard-home";
            });

            return prefs;
        }

        // Getters and Setters
        public String getDefaultView() { return defaultView; }
        public void setDefaultView(String defaultView) { this.defaultView = defaultView; }

        public boolean isShowQuickActions() { return showQuickActions; }
        public void setShowQuickActions(boolean showQuickActions) { this.showQuickActions = showQuickActions; }

        public boolean isEnableNotifications() { return enableNotifications; }
        public void setEnableNotifications(boolean enableNotifications) { this.enableNotifications = enableNotifications; }

        public String getPreferredLanguage() { return preferredLanguage; }
        public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

        public String getTheme() { return theme; }
        public void setTheme(String theme) { this.theme = theme; }
    }
}
