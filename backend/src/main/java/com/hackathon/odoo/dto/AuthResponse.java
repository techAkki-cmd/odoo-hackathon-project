package com.hackathon.odoo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * AuthResponse DTO - Base Response for Authentication Operations
 *
 * This is a versatile base response DTO that provides:
 * - Consistent response structure across all auth endpoints
 * - Success/failure indication with detailed messaging
 * - Error code classification for frontend handling
 * - Extensible design for specific operation responses
 * - Standardized timestamp and metadata inclusion
 * - Perfect foundation for LoginResponse, RegisterResponse, etc.
 *
 * @author Odoo Hackathon Team
 * @version 1.0
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    @JsonProperty("success")
    private boolean success;

    @JsonProperty("message")
    private String message;

    @JsonProperty("errorCode")
    private String errorCode;

    @JsonProperty("timestamp")
    private LocalDateTime timestamp;

    @JsonProperty("status")
    private int status;

    @JsonProperty("path")
    private String path;

    @JsonProperty("method")
    private String method;

    @JsonProperty("data")
    private Map<String, Object> data;

    @JsonProperty("metadata")
    private Metadata metadata;

    @JsonProperty("errors")
    private Map<String, String> errors;

    @JsonProperty("warnings")
    private String[] warnings;

    // ✅ DEFAULT CONSTRUCTOR
    public AuthResponse() {
        this.success = true;
        this.timestamp = LocalDateTime.now();
        this.status = 200;
        this.data = new HashMap<>();
        this.metadata = new Metadata();
    }

    // ✅ SUCCESS CONSTRUCTOR
    public AuthResponse(String message) {
        this();
        this.message = message;
    }

    // ✅ ERROR CONSTRUCTOR
    public AuthResponse(boolean success, String message, String errorCode) {
        this();
        this.success = success;
        this.message = message;
        this.errorCode = errorCode;
        this.status = success ? 200 : 400;
    }

    // ✅ COMPLETE CONSTRUCTOR
    public AuthResponse(boolean success, String message, String errorCode, int status) {
        this(success, message, errorCode);
        this.status = status;
    }

    // ✅ GETTERS AND SETTERS
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
        // Auto-adjust status if not explicitly set
        if (this.status == 200 && !success) {
            this.status = 400;
        }
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public Metadata getMetadata() {
        return metadata;
    }

    public void setMetadata(Metadata metadata) {
        this.metadata = metadata;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }

    public String[] getWarnings() {
        return warnings;
    }

    public void setWarnings(String[] warnings) {
        this.warnings = warnings;
    }

    // ✅ BUILDER PATTERN METHODS

    /**
     * Add data to the response
     */
    public AuthResponse addData(String key, Object value) {
        if (this.data == null) {
            this.data = new HashMap<>();
        }
        this.data.put(key, value);
        return this;
    }

    /**
     * Add multiple data entries
     */
    public AuthResponse addAllData(Map<String, Object> dataMap) {
        if (this.data == null) {
            this.data = new HashMap<>();
        }
        this.data.putAll(dataMap);
        return this;
    }

    /**
     * Add field error
     */
    public AuthResponse addError(String field, String error) {
        if (this.errors == null) {
            this.errors = new HashMap<>();
        }
        this.errors.put(field, error);
        return this;
    }

    /**
     * Set request context information
     */
    public AuthResponse setRequestContext(String path, String method) {
        this.path = path;
        this.method = method;
        return this;
    }

    // ✅ STATIC FACTORY METHODS

    /**
     * Create successful response
     */
    public static AuthResponse success(String message) {
        return new AuthResponse(message);
    }

    /**
     * Create successful response with data
     */
    public static AuthResponse success(String message, String dataKey, Object dataValue) {
        AuthResponse response = new AuthResponse(message);
        response.addData(dataKey, dataValue);
        return response;
    }

    /**
     * Create error response
     */
    public static AuthResponse error(String message, String errorCode) {
        return new AuthResponse(false, message, errorCode);
    }

    /**
     * Create error response with specific status
     */
    public static AuthResponse error(String message, String errorCode, int status) {
        return new AuthResponse(false, message, errorCode, status);
    }

    /**
     * Create validation error response
     */
    public static AuthResponse validationError(String message, Map<String, String> fieldErrors) {
        AuthResponse response = new AuthResponse(false, message, "VALIDATION_ERROR", 400);
        response.setErrors(fieldErrors);
        return response;
    }

    /**
     * Create unauthorized error response
     */
    public static AuthResponse unauthorized(String message) {
        return new AuthResponse(false, message, "UNAUTHORIZED", 401);
    }

    /**
     * Create forbidden error response
     */
    public static AuthResponse forbidden(String message) {
        return new AuthResponse(false, message, "FORBIDDEN", 403);
    }

    /**
     * Create not found error response
     */
    public static AuthResponse notFound(String message) {
        return new AuthResponse(false, message, "NOT_FOUND", 404);
    }

    /**
     * Create internal server error response
     */
    public static AuthResponse serverError(String message) {
        return new AuthResponse(false, message, "INTERNAL_ERROR", 500);
    }

    // ✅ UTILITY METHODS

    /**
     * Check if response indicates an error
     */
    public boolean isError() {
        return !success;
    }

    /**
     * Check if response has validation errors
     */
    public boolean hasValidationErrors() {
        return errors != null && !errors.isEmpty();
    }

    /**
     * Check if response has warnings
     */
    public boolean hasWarnings() {
        return warnings != null && warnings.length > 0;
    }

    /**
     * Get total error count
     */
    public int getErrorCount() {
        return errors != null ? errors.size() : 0;
    }

    // ✅ toString FOR DEBUGGING
    @Override
    public String toString() {
        return "AuthResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", errorCode='" + errorCode + '\'' +
                ", status=" + status +
                ", timestamp=" + timestamp +
                ", hasData=" + (data != null && !data.isEmpty()) +
                ", errorCount=" + getErrorCount() +
                '}';
    }

    // ✅ INNER CLASS FOR METADATA
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Metadata {

        @JsonProperty("requestId")
        private String requestId;

        @JsonProperty("version")
        private String version;

        @JsonProperty("environment")
        private String environment;

        @JsonProperty("serverTime")
        private LocalDateTime serverTime;

        @JsonProperty("processingTime")
        private Long processingTimeMs;

        @JsonProperty("userAgent")
        private String userAgent;

        @JsonProperty("ipAddress")
        private String ipAddress;

        // Constructor
        public Metadata() {
            this.serverTime = LocalDateTime.now();
            this.version = "1.0.0";
            this.requestId = java.util.UUID.randomUUID().toString();
        }

        // Getters and Setters
        public String getRequestId() { return requestId; }
        public void setRequestId(String requestId) { this.requestId = requestId; }

        public String getVersion() { return version; }
        public void setVersion(String version) { this.version = version; }

        public String getEnvironment() { return environment; }
        public void setEnvironment(String environment) { this.environment = environment; }

        public LocalDateTime getServerTime() { return serverTime; }
        public void setServerTime(LocalDateTime serverTime) { this.serverTime = serverTime; }

        public Long getProcessingTimeMs() { return processingTimeMs; }
        public void setProcessingTimeMs(Long processingTimeMs) { this.processingTimeMs = processingTimeMs; }

        public String getUserAgent() { return userAgent; }
        public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    }
}
