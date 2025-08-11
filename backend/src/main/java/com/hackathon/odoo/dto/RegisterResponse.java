package com.hackathon.odoo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.hackathon.odoo.entity.User;
import java.time.LocalDateTime;

/**
 * RegisterResponse DTO - Enhanced for Rental Management Platform
 *
 * This DTO provides structured responses for successful user registrations with:
 * - Role-based registration information (Customer, Owner, Business)
 * - Location and business information for property owners
 * - Enhanced next steps based on user role
 * - Security-first approach excluding sensitive data
 * - Perfect integration with rental management frontend
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegisterResponse {

    // ✅ EXISTING CORE FIELDS
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

    // ✅ NEW: RENTAL MANAGEMENT SPECIFIC FIELDS
    @JsonProperty("userRole")
    private User.UserRole userRole;

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

    @JsonProperty("platformFeatures")
    private PlatformFeatures platformFeatures;

    @JsonProperty("nextSteps")
    private NextSteps nextSteps;

    // ✅ CONSTRUCTORS
    public RegisterResponse() {
        this.success = true;
        this.timestamp = LocalDateTime.now();
        this.verificationRequired = true;
        this.verificationEmailSent = true;
        this.emailVerified = false;
        this.accountEnabled = false;
        this.isBusinessUser = false;
        this.hasBusinessInfo = false;
    }

    public RegisterResponse(String message, Long userId, String email) {
        this();
        this.message = message;
        this.userId = userId;
        this.email = email;
    }

    public RegisterResponse(String message, Long userId, String email, String firstName, String lastName,
                            User.UserRole userRole, String location) {
        this(message, userId, email);
        this.firstName = firstName;
        this.lastName = lastName;
        this.userRole = userRole;
        this.location = location;
        this.isBusinessUser = userRole == User.UserRole.OWNER || userRole == User.UserRole.BUSINESS;
        updateFullName();
    }

    // ✅ GETTERS AND SETTERS (existing ones + new ones)

    // Existing getters/setters (keep all your current ones)
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
        updateFullName();
    }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) {
        this.lastName = lastName;
        updateFullName();
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public boolean isAccountEnabled() { return accountEnabled; }
    public void setAccountEnabled(boolean accountEnabled) { this.accountEnabled = accountEnabled; }

    public boolean isVerificationEmailSent() { return verificationEmailSent; }
    public void setVerificationEmailSent(boolean verificationEmailSent) { this.verificationEmailSent = verificationEmailSent; }

    public boolean isVerificationRequired() { return verificationRequired; }
    public void setVerificationRequired(boolean verificationRequired) { this.verificationRequired = verificationRequired; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public NextSteps getNextSteps() { return nextSteps; }
    public void setNextSteps(NextSteps nextSteps) { this.nextSteps = nextSteps; }

    // ✅ NEW: RENTAL MANAGEMENT GETTERS AND SETTERS
    public User.UserRole getUserRole() { return userRole; }
    public void setUserRole(User.UserRole userRole) {
        this.userRole = userRole;
        this.isBusinessUser = userRole == User.UserRole.OWNER || userRole == User.UserRole.BUSINESS;
    }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public boolean isBusinessUser() { return isBusinessUser; }
    public void setBusinessUser(boolean businessUser) { this.isBusinessUser = businessUser; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) {
        this.businessName = businessName;
        this.hasBusinessInfo = businessName != null && !businessName.trim().isEmpty();
    }

    public User.BusinessType getBusinessType() { return businessType; }
    public void setBusinessType(User.BusinessType businessType) { this.businessType = businessType; }

    public boolean isHasBusinessInfo() { return hasBusinessInfo; }
    public void setHasBusinessInfo(boolean hasBusinessInfo) { this.hasBusinessInfo = hasBusinessInfo; }

    public PlatformFeatures getPlatformFeatures() { return platformFeatures; }
    public void setPlatformFeatures(PlatformFeatures platformFeatures) { this.platformFeatures = platformFeatures; }

    // ✅ ENHANCED UTILITY METHODS
    private void updateFullName() {
        if (firstName != null && lastName != null) {
            this.fullName = firstName + " " + lastName;
        } else if (firstName != null) {
            this.fullName = firstName;
        } else if (lastName != null) {
            this.fullName = lastName;
        }
    }

    public String getDisplayName() {
        if (hasBusinessInfo && businessName != null) {
            return businessName;
        }
        return getFullName();
    }

    // ✅ ENHANCED STATIC FACTORY METHODS
    public static RegisterResponse success(String message, Long userId, String email,
                                           String firstName, String lastName,
                                           User.UserRole userRole, String location) {
        RegisterResponse response = new RegisterResponse(message, userId, email, firstName, lastName, userRole, location);
        response.setNextSteps(NextSteps.createRoleBasedSteps(email, userRole));
        response.setPlatformFeatures(PlatformFeatures.createForRole(userRole));
        return response;
    }

    public static RegisterResponse fromUser(String message, User user) {
        RegisterResponse response = new RegisterResponse(
                message, user.getId(), user.getEmail(),
                user.getFirstName(), user.getLastName(),
                user.getUserRole(), user.getLocation()
        );

        response.setEmailVerified(user.isEmailVerified());
        response.setAccountEnabled(user.isEnabled());

        // Set business information if applicable
        if (user.isBusinessUser()) {
            response.setBusinessName(user.getBusinessName());
            response.setBusinessType(user.getBusinessType());
            response.setHasBusinessInfo(user.hasBusinessInfo());
        }

        response.setNextSteps(NextSteps.createRoleBasedSteps(user.getEmail(), user.getUserRole()));
        response.setPlatformFeatures(PlatformFeatures.createForRole(user.getUserRole()));

        return response;
    }

    // ✅ ENHANCED toString METHOD
    @Override
    public String toString() {
        return "RegisterResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", userId=" + userId +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", userRole=" + userRole +
                ", location='" + location + '\'' +
                ", isBusinessUser=" + isBusinessUser +
                ", hasBusinessInfo=" + hasBusinessInfo +
                ", emailVerified=" + emailVerified +
                ", accountEnabled=" + accountEnabled +
                ", timestamp=" + timestamp +
                '}';
    }

    // ✅ ENHANCED NEXT STEPS CLASS
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class NextSteps {

        @JsonProperty("checkEmail")
        private String checkEmail;

        @JsonProperty("verificationInstructions")
        private String verificationInstructions;

        @JsonProperty("welcomeMessage")
        private String welcomeMessage;

        @JsonProperty("roleSpecificActions")
        private String[] roleSpecificActions;

        @JsonProperty("platformIntroduction")
        private String platformIntroduction;

        @JsonProperty("troubleshooting")
        private TroubleshootingInfo troubleshooting;

        @JsonProperty("supportContact")
        private String supportContact;

        @JsonProperty("estimatedDeliveryTime")
        private String estimatedDeliveryTime;

        public NextSteps() {}

        public NextSteps(String checkEmail, String verificationInstructions, String welcomeMessage) {
            this.checkEmail = checkEmail;
            this.verificationInstructions = verificationInstructions;
            this.welcomeMessage = welcomeMessage;
            this.estimatedDeliveryTime = "2-5 minutes";
            this.supportContact = "support@renthub.com";
        }

        // ✅ ROLE-BASED FACTORY METHOD
        public static NextSteps createRoleBasedSteps(String email, User.UserRole userRole) {
            String welcomeMessage = getRoleWelcomeMessage(userRole);
            String[] roleActions = getRoleSpecificActions(userRole);
            String platformIntro = getRolePlatformIntroduction(userRole);

            NextSteps steps = new NextSteps(
                    "Please check your email inbox at: " + email,
                    "Click the verification link in the email to activate your RentHub account.",
                    welcomeMessage
            );

            steps.setRoleSpecificActions(roleActions);
            steps.setPlatformIntroduction(platformIntro);
            steps.setTroubleshooting(TroubleshootingInfo.createEmailTroubleshooting());

            return steps;
        }

        private static String getRoleWelcomeMessage(User.UserRole role) {
            return switch (role) {
                case CUSTOMER -> "Welcome to RentHub! Start browsing amazing rental properties and equipment.";
                case OWNER -> "Welcome to RentHub! Ready to start earning by renting out your properties?";
                case BUSINESS -> "Welcome to RentHub Business! Manage your rental business with our powerful tools.";
                case ADMIN -> "Welcome to RentHub Admin! You have full platform management access.";
                default -> "Welcome to RentHub! Your rental marketplace journey begins now.";
            };
        }

        private static String[] getRoleSpecificActions(User.UserRole role) {
            return switch (role) {
                case CUSTOMER -> new String[]{
                        "Browse featured rental properties",
                        "Set up your rental preferences",
                        "Explore local rental options",
                        "Complete your profile for better recommendations"
                };
                case OWNER, BUSINESS -> new String[]{
                        "List your first property or equipment",
                        "Set up your business profile",
                        "Configure pricing and availability",
                        "Upload property photos and descriptions"
                };
                case ADMIN -> new String[]{
                        "Access admin dashboard",
                        "Review platform statistics",
                        "Manage user accounts",
                        "Monitor platform health"
                };
                default -> new String[]{
                        "Complete email verification",
                        "Explore the platform",
                        "Set up your profile"
                };
            };
        }

        private static String getRolePlatformIntroduction(User.UserRole role) {
            return switch (role) {
                case CUSTOMER -> "RentHub connects you with trusted property owners and equipment providers in your area.";
                case OWNER, BUSINESS -> "RentHub helps you maximize your rental income with our comprehensive management tools.";
                case ADMIN -> "RentHub admin panel provides complete platform oversight and management capabilities.";
                default -> "RentHub is your trusted rental marketplace platform.";
            };
        }

        // Getters and Setters
        public String getCheckEmail() { return checkEmail; }
        public void setCheckEmail(String checkEmail) { this.checkEmail = checkEmail; }

        public String getVerificationInstructions() { return verificationInstructions; }
        public void setVerificationInstructions(String verificationInstructions) { this.verificationInstructions = verificationInstructions; }

        public String getWelcomeMessage() { return welcomeMessage; }
        public void setWelcomeMessage(String welcomeMessage) { this.welcomeMessage = welcomeMessage; }

        public String[] getRoleSpecificActions() { return roleSpecificActions; }
        public void setRoleSpecificActions(String[] roleSpecificActions) { this.roleSpecificActions = roleSpecificActions; }

        public String getPlatformIntroduction() { return platformIntroduction; }
        public void setPlatformIntroduction(String platformIntroduction) { this.platformIntroduction = platformIntroduction; }

        public TroubleshootingInfo getTroubleshooting() { return troubleshooting; }
        public void setTroubleshooting(TroubleshootingInfo troubleshooting) { this.troubleshooting = troubleshooting; }

        public String getSupportContact() { return supportContact; }
        public void setSupportContact(String supportContact) { this.supportContact = supportContact; }

        public String getEstimatedDeliveryTime() { return estimatedDeliveryTime; }
        public void setEstimatedDeliveryTime(String estimatedDeliveryTime) { this.estimatedDeliveryTime = estimatedDeliveryTime; }
    }

    // ✅ NEW: PLATFORM FEATURES CLASS
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PlatformFeatures {

        @JsonProperty("canBrowseRentals")
        private boolean canBrowseRentals;

        @JsonProperty("canListProperties")
        private boolean canListProperties;

        @JsonProperty("hasBusinessDashboard")
        private boolean hasBusinessDashboard;

        @JsonProperty("hasAdminAccess")
        private boolean hasAdminAccess;

        @JsonProperty("availableFeatures")
        private String[] availableFeatures;

        @JsonProperty("recommendedActions")
        private String[] recommendedActions;

        public PlatformFeatures() {}

        public static PlatformFeatures createForRole(User.UserRole role) {
            PlatformFeatures features = new PlatformFeatures();

            switch (role) {
                case CUSTOMER -> {
                    features.setCanBrowseRentals(true);
                    features.setCanListProperties(false);
                    features.setHasBusinessDashboard(false);
                    features.setHasAdminAccess(false);
                    features.setAvailableFeatures(new String[]{
                            "Browse rental properties", "Book rentals", "Review properties", "Manage bookings"
                    });
                    features.setRecommendedActions(new String[]{
                            "Complete profile setup", "Browse featured properties", "Set location preferences"
                    });
                }
                case OWNER, BUSINESS -> {
                    features.setCanBrowseRentals(true);
                    features.setCanListProperties(true);
                    features.setHasBusinessDashboard(true);
                    features.setHasAdminAccess(false);
                    features.setAvailableFeatures(new String[]{
                            "List properties", "Manage bookings", "Track earnings", "Customer communication", "Analytics dashboard"
                    });
                    features.setRecommendedActions(new String[]{
                            "List your first property", "Upload property photos", "Set competitive pricing"
                    });
                }
                case ADMIN -> {
                    features.setCanBrowseRentals(true);
                    features.setCanListProperties(true);
                    features.setHasBusinessDashboard(true);
                    features.setHasAdminAccess(true);
                    features.setAvailableFeatures(new String[]{
                            "Full platform access", "User management", "Content moderation", "Analytics", "System configuration"
                    });
                    features.setRecommendedActions(new String[]{
                            "Review platform statistics", "Check pending approvals", "Monitor user activity"
                    });
                }
            }

            return features;
        }

        // Getters and Setters
        public boolean isCanBrowseRentals() { return canBrowseRentals; }
        public void setCanBrowseRentals(boolean canBrowseRentals) { this.canBrowseRentals = canBrowseRentals; }

        public boolean isCanListProperties() { return canListProperties; }
        public void setCanListProperties(boolean canListProperties) { this.canListProperties = canListProperties; }

        public boolean isHasBusinessDashboard() { return hasBusinessDashboard; }
        public void setHasBusinessDashboard(boolean hasBusinessDashboard) { this.hasBusinessDashboard = hasBusinessDashboard; }

        public boolean isHasAdminAccess() { return hasAdminAccess; }
        public void setHasAdminAccess(boolean hasAdminAccess) { this.hasAdminAccess = hasAdminAccess; }

        public String[] getAvailableFeatures() { return availableFeatures; }
        public void setAvailableFeatures(String[] availableFeatures) { this.availableFeatures = availableFeatures; }

        public String[] getRecommendedActions() { return recommendedActions; }
        public void setRecommendedActions(String[] recommendedActions) { this.recommendedActions = recommendedActions; }
    }

    // ✅ KEEP YOUR EXISTING TROUBLESHOOTING CLASS (it's perfect)
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

        public TroubleshootingInfo() {
            this.checkSpamFolder = true;
            this.resendAvailable = true;
        }

        public static TroubleshootingInfo createEmailTroubleshooting() {
            TroubleshootingInfo info = new TroubleshootingInfo();
            info.setCommonIssues(new String[]{
                    "Check your spam/junk folder",
                    "Verify email address spelling",
                    "Wait up to 5 minutes for delivery",
                    "Check promotions tab (Gmail users)"
            });
            info.setHelpfulTips(new String[]{
                    "Add noreply@renthub.com to your contacts",
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
