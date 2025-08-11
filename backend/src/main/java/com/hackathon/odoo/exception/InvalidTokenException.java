package com.hackathon.odoo.exception;

/**
 * Exception thrown when a provided authentication or verification token is invalid.
 *
 * This exception is typically thrown during:
 * - Email verification with an invalid token
 * - Password reset with an invalid token
 * - JWT token validation failures
 * - Any token-based authentication where the token format or content is invalid
 *
 * @author Odoo Hackathon Team
 * @since 1.0
 */
public class InvalidTokenException extends RuntimeException {

    /**
     * Constructs a new InvalidTokenException with no detail message.
     */
    public InvalidTokenException() {
        super();
    }

    /**
     * Constructs a new InvalidTokenException with the specified detail message.
     *
     * @param message the detail message (which is saved for later retrieval by the getMessage() method)
     */
    public InvalidTokenException(String message) {
        super(message);
    }

    /**
     * Constructs a new InvalidTokenException with the specified detail message and cause.
     *
     * @param message the detail message (which is saved for later retrieval by the getMessage() method)
     * @param cause the cause (which is saved for later retrieval by the getCause() method)
     */
    public InvalidTokenException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new InvalidTokenException with the specified cause.
     *
     * @param cause the cause (which is saved for later retrieval by the getCause() method)
     */
    public InvalidTokenException(Throwable cause) {
        super(cause);
    }

    /**
     * Constructs a new InvalidTokenException with the specified detail message,
     * cause, suppression enabled or disabled, and writable stack trace enabled or disabled.
     *
     * @param message the detail message
     * @param cause the cause
     * @param enableSuppression whether or not suppression is enabled or disabled
     * @param writableStackTrace whether or not the stack trace should be writable
     */
    protected InvalidTokenException(String message, Throwable cause,
                                    boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
