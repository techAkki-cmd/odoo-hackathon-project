// src/pages/verification.js - Professional Email Verification Page
// 🏆 Perfectly integrated with your modular architecture and authService

import { authService } from '../api/authService.js';
import { utils, icons, createFloatingElements, notificationManager } from '../utils/common.js';

// 🎯 Email Verification Page Renderer - Professional Design
export function renderEmailVerification() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
            ${createFloatingElements()}

            <div class="w-full max-w-md relative z-10">
                <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
                    <!-- Premium Gradient Overlay -->
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>

                    <div id="verification-content" class="text-center">
                        <!-- Loading State -->
                        <div id="verification-loading" class="mb-6">
                            <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                <div class="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
                            </div>
                            <h2 class="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
                            <p class="text-gray-600">Please wait while we verify your email address...</p>
                            <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p class="text-xs text-blue-600" id="verification-progress">Connecting to server...</p>
                            </div>
                        </div>

                        <!-- Success State (hidden initially) -->
                        <div id="verification-success" class="hidden mb-6">
                            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-bounce">
                                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h2 class="text-2xl font-bold text-green-600 mb-2">🎉 Email Verified!</h2>
                            <p class="text-gray-600">Your account has been successfully verified.</p>
                            <div class="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                                <p class="text-sm text-green-700">You can now sign in to your account and start participating in the hackathon!</p>
                            </div>
                        </div>

                        <!-- Error State (hidden initially) -->
                        <div id="verification-error" class="hidden mb-6">
                            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <h2 class="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
                            <p id="error-message" class="text-gray-600 mb-4">Sorry, we couldn't verify your email address.</p>
                            <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p class="text-sm text-red-700">This could happen if the verification link has expired or has already been used.</p>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div id="verification-actions" class="hidden space-y-3">
                            <button
                                onclick="navigateToLogin()"
                                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                                Continue to Sign In
                            </button>

                            <button
                                id="resend-verification-btn"
                                onclick="handleResendVerification()"
                                class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-300">
                                Resend Verification Email
                            </button>

                            <button
                                onclick="goToHome()"
                                class="w-full text-gray-500 hover:text-gray-700 py-2 transition-colors duration-200">
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Help Section -->
                <div class="mt-6 text-center">
                    <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                        <h4 class="text-sm font-semibold text-gray-700 mb-2">Need Help?</h4>
                        <p class="text-xs text-gray-600 mb-2">If you're having trouble with email verification:</p>
                        <ul class="text-xs text-gray-500 space-y-1">
                            <li>• Check your spam/junk folder</li>
                            <li>• Make sure the link hasn't expired</li>
                            <li>• Try requesting a new verification email</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 🎯 Email Verification Event Listeners - Professional Implementation
export function attachEmailVerificationListeners() {
    console.log('📧 Attaching email verification listeners');

    // Start verification process immediately
    setTimeout(() => {
        initializeEmailVerification();
    }, 500);
}

// 🚀 Enhanced Email Verification Logic - Using Your authService
export async function initializeEmailVerification() {
    console.log('🔍 Starting email verification process');

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        console.error('❌ No verification token found in URL');
        showVerificationError('No verification token found in URL. Please check your email link.');
        return;
    }

    console.log('🔍 Processing verification token:', token.substring(0, 8) + '...');

    // Update progress
    updateVerificationProgress('Validating token...');

    try {
        // Use your professional authService
        const result = await authService.verifyEmail(token);

        if (result.success) {
            console.log('✅ Email verification successful');
            showVerificationSuccess(result.message);

            // Clear the token from URL for security
            window.history.replaceState({}, document.title, window.location.pathname);

            // Auto-redirect after 3 seconds
            setTimeout(() => {
                navigateToLogin();
            }, 3000);
        } else {
            console.error('❌ Email verification failed:', result.message);
            showVerificationError(result.message || 'Email verification failed');
        }

    } catch (error) {
        console.error('❌ Verification error:', error);
        showVerificationError(error.message || 'Verification failed. Please try again.');
    }
}

// 🎯 Helper Functions for UI State Management
function updateVerificationProgress(message) {
    const progressEl = document.getElementById('verification-progress');
    if (progressEl) {
        progressEl.textContent = message;
    }
}

function showVerificationSuccess(message = null) {
    const loadingEl = document.getElementById('verification-loading');
    const errorEl = document.getElementById('verification-error');
    const successEl = document.getElementById('verification-success');
    const actionsEl = document.getElementById('verification-actions');

    if (loadingEl) loadingEl.classList.add('hidden');
    if (errorEl) errorEl.classList.add('hidden');
    if (successEl) successEl.classList.remove('hidden');
    if (actionsEl) actionsEl.classList.remove('hidden');

    // Update success message if provided
    if (message) {
        const successText = successEl.querySelector('p');
        if (successText) {
            successText.textContent = message;
        }
    }

    // Play success sound
    utils.playSound?.('success');
    utils.vibrate?.([100, 50, 100]);
}

function showVerificationError(message) {
    const loadingEl = document.getElementById('verification-loading');
    const successEl = document.getElementById('verification-success');
    const errorEl = document.getElementById('verification-error');
    const actionsEl = document.getElementById('verification-actions');
    const messageEl = document.getElementById('error-message');

    if (loadingEl) loadingEl.classList.add('hidden');
    if (successEl) successEl.classList.add('hidden');
    if (errorEl) errorEl.classList.remove('hidden');
    if (actionsEl) actionsEl.classList.remove('hidden');
    if (messageEl) messageEl.textContent = message;

    // Play error sound
    utils.playSound?.('error');
}

// 🎯 Navigation Functions - Integrated with Your App
function navigateToLogin() {
    console.log('🧭 Navigating to login page');
    if (window.app && window.app.navigate) {
        window.app.navigate('login');
    } else {
        window.location.href = '/login';
    }
}

function goToHome() {
    console.log('🏠 Navigating to home');
    if (window.app && window.app.navigate) {
        window.app.navigate('login'); // Since login is your home page
    } else {
        window.location.href = '/';
    }
}

// 🔄 Resend Verification Handler - Using Your authService
async function handleResendVerification() {
    const button = document.getElementById('resend-verification-btn');
    const originalText = button.textContent;

    try {
        // Get email from URL params or prompt user
        const urlParams = new URLSearchParams(window.location.search);
        let email = urlParams.get('email');

        if (!email) {
            email = prompt('Please enter your email address to resend verification:');
            if (!email) return;
        }

        // Disable button and show loading
        button.disabled = true;
        button.textContent = '⏳ Sending...';

        // Use your professional authService
        await authService.resendVerificationEmail(email);

        // Show success
        button.textContent = '✅ Sent!';
        notificationManager.show('Verification email sent! Please check your inbox.', 'success');

        // Reset button after 3 seconds
        setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
        }, 3000);

    } catch (error) {
        console.error('❌ Failed to resend verification:', error);

        // Show error
        button.textContent = '❌ Failed';
        notificationManager.show('Failed to send verification email. Please try again.', 'error');

        // Reset button after 3 seconds
        setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
        }, 3000);
    }
}

// 🌐 Make functions globally available for onclick handlers
if (typeof window !== 'undefined') {
    window.navigateToLogin = navigateToLogin;
    window.goToHome = goToHome;
    window.handleResendVerification = handleResendVerification;
}

// Export for ES6 modules
export {

    showVerificationSuccess,
    showVerificationError
};
