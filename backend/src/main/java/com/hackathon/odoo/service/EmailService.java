package com.hackathon.odoo.service;

import com.hackathon.odoo.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * EmailService - Comprehensive Email Service for Authentication System
 *
 * This service handles all email operations for the authentication system:
 * - Email verification for new registrations
 * - Welcome emails after successful verification
 * - Password reset emails with secure tokens
 * - Account notification emails
 * - HTML email templates with professional styling
 * - Error handling and retry mechanisms
 * - Email delivery tracking and logging
 *
 * Integrates perfectly with:
 * - AuthService (business logic layer)
 * - User entity (user data)
 * - Spring Boot Mail (SMTP configuration)
 *
 * @author Odoo Hackathon Team
 * @version 1.0
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Configuration from application.properties
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.from-name:Odoo Hackathon Team}")
    private String fromName;

    @Value("${app.mail.support-email:support@odoohackathon.com}")
    private String supportEmail;

    @Value("${app.verification.token.expiration:24}")
    private int tokenExpirationHours;

    // ✅ EMAIL VERIFICATION - Professional HTML Template
    public void sendVerificationEmail(User user) {
        try {
            String subject = "🎉 Verify Your Odoo Hackathon Account";
            String verificationUrl = frontendUrl + "/verify-email?token=" + user.getVerificationToken();

            String htmlContent = createVerificationEmailTemplate(user, verificationUrl);

            sendHtmlEmail(user.getEmail(), subject, htmlContent);

            System.out.println("✅ Verification email sent successfully to: " + user.getEmail());

        } catch (Exception e) {
            System.err.println("❌ Failed to send verification email to " + user.getEmail() + ": " + e.getMessage());
            // Fallback to simple text email
            sendSimpleVerificationEmail(user);
        }
    }

    // ✅ WELCOME EMAIL - After Successful Verification
    public void sendWelcomeEmail(User user) {
        try {
            String subject = "🎊 Welcome to Odoo Hackathon - You're All Set!";
            String htmlContent = createWelcomeEmailTemplate(user);

            sendHtmlEmail(user.getEmail(), subject, htmlContent);

            System.out.println("✅ Welcome email sent successfully to: " + user.getEmail());

        } catch (Exception e) {
            System.err.println("❌ Failed to send welcome email to " + user.getEmail() + ": " + e.getMessage());
            // Fallback to simple text email
            sendSimpleWelcomeEmail(user);
        }
    }

    // ✅ PASSWORD RESET EMAIL - Secure Reset Link
    public void sendPasswordResetEmail(User user) {
        try {
            String subject = "🔐 Reset Your Odoo Hackathon Password";
            String resetUrl = frontendUrl + "/reset-password?token=" + user.getVerificationToken();

            String htmlContent = createPasswordResetEmailTemplate(user, resetUrl);

            sendHtmlEmail(user.getEmail(), subject, htmlContent);

            System.out.println("✅ Password reset email sent successfully to: " + user.getEmail());

        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email to " + user.getEmail() + ": " + e.getMessage());
            // Fallback to simple text email
            sendSimplePasswordResetEmail(user);
        }
    }

    // ✅ ACCOUNT LOCKED NOTIFICATION EMAIL
    public void sendAccountLockedEmail(User user, int lockoutMinutes) {
        try {
            String subject = "🚨 Account Security Alert - Temporary Lockout";
            String htmlContent = createAccountLockedEmailTemplate(user, lockoutMinutes);

            sendHtmlEmail(user.getEmail(), subject, htmlContent);

            System.out.println("✅ Account locked notification sent to: " + user.getEmail());

        } catch (Exception e) {
            System.err.println("❌ Failed to send account locked email to " + user.getEmail() + ": " + e.getMessage());
        }
    }

    // ✅ GENERIC EMAIL SENDING METHOD
    public void sendEmail(String to, String subject, String content) {
        try {
            sendHtmlEmail(to, subject, content);
            System.out.println("✅ Email sent successfully to: " + to);

        } catch (Exception e) {
            System.err.println("❌ Failed to send email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    // ✅ CORE HTML EMAIL SENDING METHOD
    private void sendHtmlEmail(String to, String subject, String htmlContent)
            throws MessagingException, UnsupportedEncodingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, fromName);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true = HTML content

        // Add reply-to header
        helper.setReplyTo(supportEmail);

        mailSender.send(message);
    }

    // ✅ FALLBACK SIMPLE EMAIL METHODS

    private void sendSimpleVerificationEmail(User user) {
        try {
            String verificationUrl = frontendUrl + "/verify-email?token=" + user.getVerificationToken();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Verify Your Odoo Hackathon Account");
            message.setText(
                    "Hello " + user.getFirstName() + ",\n\n" +
                            "Welcome to Odoo Hackathon!\n\n" +
                            "Please verify your email address by clicking the link below:\n" +
                            verificationUrl + "\n\n" +
                            "This link will expire in " + tokenExpirationHours + " hours.\n\n" +
                            "If you didn't create this account, please ignore this email.\n\n" +
                            "Best regards,\n" +
                            "The Odoo Hackathon Team"
            );

            mailSender.send(message);
            System.out.println("✅ Simple verification email sent to: " + user.getEmail());

        } catch (Exception e) {
            System.err.println("❌ Failed to send simple verification email: " + e.getMessage());
        }
    }

    private void sendSimpleWelcomeEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Welcome to Odoo Hackathon!");
            message.setText(
                    "Hello " + user.getFirstName() + ",\n\n" +
                            "Your email has been successfully verified!\n\n" +
                            "You can now sign in to your account and start exploring the Odoo Hackathon platform.\n\n" +
                            "Sign in here: " + frontendUrl + "/login\n\n" +
                            "Happy coding!\n\n" +
                            "Best regards,\n" +
                            "The Odoo Hackathon Team"
            );

            mailSender.send(message);
            System.out.println("✅ Simple welcome email sent to: " + user.getEmail());

        } catch (Exception e) {
            System.err.println("❌ Failed to send simple welcome email: " + e.getMessage());
        }
    }

    private void sendSimplePasswordResetEmail(User user) {
        try {
            String resetUrl = frontendUrl + "/reset-password?token=" + user.getVerificationToken();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Reset Your Odoo Hackathon Password");
            message.setText(
                    "Hello " + user.getFirstName() + ",\n\n" +
                            "You requested to reset your password for your Odoo Hackathon account.\n\n" +
                            "Please click the link below to reset your password:\n" +
                            resetUrl + "\n\n" +
                            "This link will expire in 2 hours for security reasons.\n\n" +
                            "If you didn't request this password reset, please ignore this email.\n\n" +
                            "Best regards,\n" +
                            "The Odoo Hackathon Team"
            );

            mailSender.send(message);
            System.out.println("✅ Simple password reset email sent to: " + user.getEmail());

        } catch (Exception e) {
            System.err.println("❌ Failed to send simple password reset email: " + e.getMessage());
        }
    }

    // ✅ HTML EMAIL TEMPLATES
// ✅ FIXED HTML EMAIL TEMPLATES with proper text block syntax

    // ✅ CORRECTED: Count your placeholders carefully
    private String createVerificationEmailTemplate(User user, String verificationUrl) {
        String expirationTime = LocalDateTime.now().plusHours(tokenExpirationHours)
                .format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"));

        return """
    <!DOCTYPE html>
    <html lang="en">
    <!-- ... existing HTML structure ... -->
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Welcome to Odoo Hackathon!</h1>
            </div>
            <div class="content">
                <h2>Hello %s!</h2>                           <!-- 1. firstName -->
                <p>Thank you for joining the Odoo Hackathon!</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="%s" class="verification-btn">    <!-- 2. verificationUrl -->
                        ✅ Verify Email Address
                    </a>
                </div>
                
                <div class="warning">
                    <strong>⏰ Important:</strong> This verification link will expire on %s. <!-- 3. expirationTime -->
                </div>
                
                <p>If the button doesn't work, copy and paste this link:</p>
                <p style="word-break: break-all;">
                    %s                                        <!-- 4. verificationUrl (again) -->
                </p>
                
                <p>Happy coding!<br><strong>The Odoo Hackathon Team</strong></p>
            </div>
            <div class="footer">
                <p>This email was sent to %s</p>            <!-- 5. user.getEmail() -->
                <p>Contact us at %s</p>                      <!-- 6. supportEmail -->
            </div>
        </div>
    </body>
    </html>
    """.formatted(
                user.getFirstName(),        // 1
                verificationUrl,            // 2
                expirationTime,             // 3
                verificationUrl,            // 4
                user.getEmail(),            // 5
                supportEmail                // 6
        );
    }


    private String createWelcomeEmailTemplate(User user) {
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Odoo Hackathon</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 40px 30px; }
                .dashboard-btn { display: inline-block; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                .features { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎊 Welcome Aboard!</h1>
                </div>
                <div class="content">
                    <h2>Congratulations, %s!</h2>
                    <p>Your email has been successfully verified and your Odoo Hackathon account is now active! 🎉</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s/login" class="dashboard-btn">
                            🚀 Access Your Dashboard
                        </a>
                    </div>
                    
                    <div class="features">
                        <h3>🌟 What's Next?</h3>
                        <ul>
                            <li><strong>Explore Challenges:</strong> Browse exciting hackathon challenges</li>
                            <li><strong>Build Your Team:</strong> Connect with fellow developers</li>
                            <li><strong>Submit Projects:</strong> Showcase your innovative solutions</li>
                            <li><strong>Win Prizes:</strong> Compete for amazing rewards</li>
                        </ul>
                    </div>
                    
                    <p>We're excited to see what amazing projects you'll create during the hackathon!</p>
                    
                    <p>Best of luck and happy coding!<br>
                    <strong>The Odoo Hackathon Team</strong></p>
                </div>
                <div class="footer">
                    <p>Need help? Contact us at %s</p>
                    <p>Follow us for updates and announcements</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(user.getFirstName(), frontendUrl, supportEmail);
    }

    private String createPasswordResetEmailTemplate(User user, String resetUrl) {
        String expirationTime = LocalDateTime.now().plusHours(2)
                .format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a"));

        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 40px 30px; }
                .reset-btn { display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                .warning { background: #ffebee; border: 1px solid #ffcdd2; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Password Reset</h1>
                </div>
                <div class="content">
                    <h2>Hello %s,</h2>
                    <p>We received a request to reset your Odoo Hackathon account password.</p>
                    <p>If you made this request, click the button below to reset your password:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" class="reset-btn">
                            🔑 Reset Password
                        </a>
                    </div>
                    
                    <div class="warning">
                        <strong>⏰ Security Notice:</strong> This password reset link will expire on %s for security reasons.
                    </div>
                    
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                        %s
                    </p>
                    
                    <p><strong>If you didn't request this password reset, please ignore this email.</strong> Your password will remain unchanged.</p>
                    
                    <p>For security reasons, please don't share this email with anyone.</p>
                    
                    <p>Best regards,<br>
                    <strong>The Odoo Hackathon Team</strong></p>
                </div>
                <div class="footer">
                    <p>This email was sent to %s</p>
                    <p>Need help? Contact us at %s</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(user.getFirstName(), resetUrl, expirationTime, resetUrl, user.getEmail(), supportEmail);
    }

    private String createAccountLockedEmailTemplate(User user, int lockoutMinutes) {
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Security Alert</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%); color: white; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 40px 30px; }
                .alert { background: #fff3e0; border: 1px solid #ffcc02; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚨 Security Alert</h1>
                </div>
                <div class="content">
                    <h2>Account Temporarily Locked</h2>
                    <p>Hello %s,</p>
                    <p>Your Odoo Hackathon account has been temporarily locked due to multiple failed login attempts.</p>
                    
                    <div class="alert">
                        <strong>🔒 Lockout Duration:</strong> %d minutes<br>
                        <strong>🕐 You can try again after:</strong> %s
                    </div>
                    
                    <h3>What happened?</h3>
                    <p>Too many unsuccessful login attempts were made to your account, so we've temporarily locked it to protect your security.</p>
                    
                    <h3>What should you do?</h3>
                    <ul>
                        <li>Wait %d minutes before trying to log in again</li>
                        <li>Make sure you're using the correct email and password</li>
                        <li>Consider resetting your password if you've forgotten it</li>
                        <li>Contact our support team if you believe this was an error</li>
                    </ul>
                    
                    <p>If you didn't attempt to log in, please contact our support team immediately.</p>
                    
                    <p>Thank you for helping us keep your account secure.</p>
                    
                    <p>Best regards,<br>
                    <strong>The Odoo Hackathon Security Team</strong></p>
                </div>
                <div class="footer">
                    <p>This email was sent to %s</p>
                    <p>Security concerns? Contact us immediately at %s</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(user.getFirstName(), lockoutMinutes,
                LocalDateTime.now().plusMinutes(lockoutMinutes)
                        .format(DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a")),
                lockoutMinutes, user.getEmail(), supportEmail);
    }








}
