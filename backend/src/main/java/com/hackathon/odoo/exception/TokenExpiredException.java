package com.hackathon.odoo.exception;

import java.time.LocalDateTime;

/**
 * Exception thrown when a token has expired and is no longer valid for authentication or verification.
 *
 * This exception is typically thrown during:
 * - Email verification attempts with expired tokens
 * - Password reset attempts with expired tokens
 * - Session tokens that have exceeded their validity period
 * - Any time-sensitive token validation
 *
 * @author Odoo Hackathon Team
 * @since 1.0
 */
public class TokenExpiredException extends RuntimeException {

    private LocalDateTime expirationTime;
    private String tokenType;

    /**
     * Constructs a new TokenExpiredException with no detail message.
     */
    public TokenExpiredException() {
        super();
    }

    /**
     * Constructs a new TokenExpiredException with the specified detail message.
     *
     * @param message the detail message (which is saved for later retrieval by the getMessage() method)
     */
    public TokenExpiredException(String message) {
        super(message);
    }

    /**
     * Constructs a new TokenExpiredException with the specified detail message and cause.
     *
     * @param message the detail message (which is saved for later retrieval by the getMessage() method)
     * @param cause the cause (which is saved for later retrieval by the getCause() method)
     */
    public TokenExpiredException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new TokenExpiredException with the specified cause.
     *
     * @param cause the cause (which is saved for later retrieval by the getCause() method)
     */
    public TokenExpiredException(Throwable cause) {
        super(cause);
    }

    /**
     * Constructs a new TokenExpiredException with token-specific information.
     *
     * @param message the detail message
     * @param tokenType the type of token that expired (e.g., "email_verification", "password_reset")
     * @param expirationTime the time when the token expired
     */
    public TokenExpiredException(String message, String tokenType, LocalDateTime expirationTime) {
        super(message);
        this.tokenType = tokenType;
        this.expirationTime = expirationTime;
    }

    /**
     * Constructs a new TokenExpiredException with the specified detail message,
     * cause, suppression enabled or disabled, and writable stack trace enabled or disabled.
     *
     * @param message the detail message
     * @param cause the cause
     * @param enableSuppression whether or not suppression is enabled or disabled
     * @param writableStackTrace whether or not the stack trace should be writable
     */
    protected TokenExpiredException(String message, Throwable cause,
                                    boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

    /**
     * Gets the expiration time of the token.
     *
     * @return the expiration time, or null if not specified
     */
    public LocalDateTime getExpirationTime() {
        return expirationTime;
    }

    /**
     * Sets the expiration time of the token.
     *
     * @param expirationTime the expiration time
     */
    public void setExpirationTime(LocalDateTime expirationTime) {
        this.expirationTime = expirationTime;
    }

    /**
     * Gets the type of token that expired.
     *
     * @return the token type, or null if not specified
     */
    public String getTokenType() {
        return tokenType;
    }

    /**
     * Sets the type of token that expired.
     *
     * @param tokenType the token type
     */
    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    /**
     * Returns a detailed string representation of this exception.
     *
     * @return a string representation including token type and expiration time
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder(super.toString());

        if (tokenType != null) {
            sb.append(" [tokenType=").append(tokenType).append("]");
        }

        if (expirationTime != null) {
            sb.append(" [expiredAt=").append(expirationTime).append("]");
        }

        return sb.toString();
    }
}
