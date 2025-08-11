// src/login.js - Enhanced for Perfect Spring Boot Backend Integration
// 🏆 Perfect integration with LoginRequest/LoginResponse DTOs and AuthController

import { icons, utils, CONFIG, createFloatingElements, debounce } from '../utils/common.js';
import { authService } from '../api/authService.js';

// State management
let showPassword = false;
let isLoading = false;
let loginAttempts = 0;

// Perfect Animation class
class LoginAnimations {
  static shake(element, intensity = 'normal') {
    if (!element) return;

    const intensityMap = {
      light: 'animate-shake-light',
      normal: 'animate-shake',
      strong: 'animate-shake-strong'
    };

    const className = intensityMap[intensity] || intensityMap.normal;
    element.classList.add(className);

    element.addEventListener('animationend', () => {
      element.classList.remove(className);
    }, { once: true });
  }

  static fadeIn(element, delay = 0) {
    if (!element) return;

    setTimeout(() => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.6s ease';

      requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });
    }, delay);
  }
}

// ✅ ENHANCED validation functions - Perfect backend matching
function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return { isValid: false, message: 'Email address is required' };
  }
  // Enhanced email validation to match backend exactly
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: 'Valid email' };
}

function validatePassword(password) {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  return { isValid: true, message: 'Valid password' };
}

// ✅ ENHANCED login page renderer with better UX
export function renderLoginPage(initialEmail = '') {
  return `
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-6">
      ${createFloatingElements()}

      <!-- Enhanced Loading Overlay -->
      <div id="login-overlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-500 ${isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'}">
        <div class="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm w-full mx-4">
          <div class="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-600 font-medium mb-2">Signing you in...</p>
          <p class="text-gray-500 text-sm">Please wait while we verify your credentials</p>
        </div>
      </div>

      <div class="bg-white bg-opacity-90 rounded-xl shadow-xl max-w-md w-full p-8 relative">
        <header class="text-center mb-8">
          <div class="inline-block p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-4">
            ${icons.rocket}
          </div>
          <h1 class="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p class="text-gray-600 mt-2">Sign in to your Odoo Hackathon account</p>
        </header>

        <!-- Enhanced Form with Better Accessibility -->
        <form id="login-form" class="space-y-6" novalidate>
          <!-- Email Field with Enhanced Validation -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
              required
              maxlength="255"
              autocomplete="email"
              value="${initialEmail}"
            />
            <div id="email-error" class="text-red-500 text-xs mt-1 hidden flex items-center">
              <span class="mr-1">⚠️</span>
              <span class="error-text"></span>
            </div>
          </div>

          <!-- Enhanced Password Field -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">
              Password *
            </label>
            <div class="relative">
              <input
                type="password"
                id="password"
                name="password"
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all duration-200"
                placeholder="Enter your password"
                required
                autocomplete="current-password"
              />
              <button type="button" id="toggle-password" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200">
                ${icons.eye}
              </button>
            </div>
            <div id="password-error" class="text-red-500 text-xs mt-1 hidden flex items-center">
              <span class="mr-1">⚠️</span>
              <span class="error-text"></span>
            </div>
          </div>

          <!-- Enhanced Options Row -->
          <div class="flex items-center justify-between">
            <label class="flex items-center text-sm cursor-pointer">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="text-gray-700">Remember me</span>
            </label>
            <button
              type="button"
              id="forgot-password"
              class="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors duration-200"
            >
              Forgot password?
            </button>
          </div>

          <!-- Enhanced Submit Button -->
          <button
            type="submit"
            id="login-submit"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold p-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled
          >
            <span id="submit-text">Sign In</span>
          </button>
        </form>

        <!-- Enhanced Account Creation Link -->
        <div class="mt-6 text-center p-4 bg-gray-50 rounded-lg">
          <span class="text-gray-700">Don't have an account?</span>
          <button type="button" id="create-account" class="ml-2 text-blue-600 hover:text-blue-800 underline font-semibold transition-colors duration-200">
            Create Account
          </button>
        </div>

        <!-- Enhanced Social Login Section -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <button type="button" id="google-login" class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.01 2c5.52 0 10 4.48 10 10s-4.48 10-10 10-10-4.48-10-10 4.48-10 10-10zm0 18c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8 3.59 8 8 8z"/>
                <path fill="#4285F4" d="M12.01 8.5c1.24 0 2.36.44 3.23 1.15l2.41-2.41c-1.46-1.37-3.37-2.24-5.64-2.24-3.53 0-6.54 2.31-7.6 5.5l2.8 2.18c.66-1.97 2.49-3.18 4.8-3.18z"/>
                <path fill="#34A853" d="M5.21 9.82l-2.8-2.18c-.47 1.05-.72 2.21-.72 3.36 0 1.15.25 2.31.72 3.36l2.8-2.18c-.21-.63-.32-1.29-.32-1.98s.11-1.35.32-1.98z"/>
                <path fill="#FBBC05" d="M12.01 16.5c-2.31 0-4.14-1.21-4.8-3.18l-2.8 2.18c1.06 3.19 4.07 5.5 7.6 5.5 2.11 0 4.06-.87 5.45-2.26l-2.66-2.07c-.74.5-1.68.83-2.79.83z"/>
                <path fill="#EA4335" d="M19.46 14.24l2.66 2.07c1.39-1.39 2.26-3.34 2.26-5.45 0-.6-.05-1.19-.16-1.76h-9.21v3.35h5.29c-.23 1.23-.93 2.28-1.84 2.79z"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">Google</span>
            </button>

            <button type="button" id="microsoft-login" class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">Microsoft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ✅ ENHANCED field validation helpers
function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const inputElement = document.getElementById(fieldName);
  const errorTextElement = errorElement?.querySelector('.error-text');

  if (errorElement && inputElement && errorTextElement) {
    errorTextElement.textContent = message;
    errorElement.classList.remove('hidden');
    inputElement.classList.add('border-red-500', 'focus:ring-red-500');
    inputElement.classList.remove('border-green-500', 'focus:ring-blue-500');
  }
}

function clearFieldError(fieldName) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const inputElement = document.getElementById(fieldName);

  if (errorElement && inputElement) {
    errorElement.classList.add('hidden');
    inputElement.classList.remove('border-red-500', 'focus:ring-red-500');
    inputElement.classList.add('border-green-500', 'focus:ring-green-500');

    // Add success indication temporarily
    setTimeout(() => {
      inputElement.classList.remove('border-green-500', 'focus:ring-green-500');
      inputElement.classList.add('focus:ring-blue-500');
    }, 2000);
  }
}

function validateField(fieldName, value) {
  let validation;

  switch (fieldName) {
    case 'email':
      validation = validateEmail(value);
      break;
    case 'password':
      validation = validatePassword(value);
      break;
    default:
      return false;
  }

  if (validation.isValid) {
    clearFieldError(fieldName);
    return true;
  } else {
    showFieldError(fieldName, validation.message);
    return false;
  }
}

// ✅ ENHANCED login handler - Perfect backend integration
async function handleLogin(event) {
  event.preventDefault();

  if (isLoading) return;

  console.log('🔐 Enhanced login initiated');

  // Get form data using CORRECT IDs that match backend LoginRequest DTO
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('remember').checked;

  // Clear previous errors
  ['email', 'password'].forEach(field => {
    clearFieldError(field);
  });

  // Validate all fields
  let isValid = true;

  if (!validateField('email', email)) isValid = false;
  if (!validateField('password', password)) isValid = false;

  // If validation fails, shake form
  if (!isValid) {
    console.log('❌ Form validation failed');
    LoginAnimations.shake(document.getElementById('login-form'));
    return;
  }

  // Prepare login data - EXACTLY matches backend LoginRequest DTO
  const loginData = {
    email,          // matches LoginRequest.email
    password,       // matches LoginRequest.password
    rememberMe      // matches LoginRequest.rememberMe
    // Backend will set deviceInfo, userAgent, ipAddress automatically
  };

  console.log('📝 Login data prepared for backend:', {
    email: loginData.email,
    rememberMe: loginData.rememberMe,
    password: '***' // Never log actual password
  });

  // Set loading state
  isLoading = true;
  setLoadingState(true);

  try {
    console.log('📤 Sending login request to backend...');

    // Call the login service - matches backend POST /api/auth/login
    const response = await authService.login(loginData);

    console.log('✅ Login response received:', response);

    // Handle different response scenarios based on LoginResponse DTO
    if (response.success) {
      console.log('🎉 Login successful!');

      // Reset login attempts
      loginAttempts = 0;

      // Show enhanced success message
      showEnhancedSuccessMessage(response);

      // Navigate based on backend response
      setTimeout(() => {
        const redirectUrl = response.redirectUrl || '/dashboard';
        window.dispatchEvent(new CustomEvent('navigate', {
          detail: { view: redirectUrl.replace('/', '') || 'dashboard' }
        }));
      }, 1500);

    } else {
      throw new Error(response.message || 'Login failed');
    }

  } catch (error) {
    console.error('❌ Login failed:', error);
    loginAttempts++;

    // Enhanced error handling based on backend error codes
    let errorMessage = 'Invalid email or password';
    let errorType = 'error';

    if (error.message) {
      if (error.message.includes('verify your email') || error.errorCode === 'ACCOUNT_NOT_VERIFIED') {
        errorMessage = 'Please verify your email address before signing in. Check your inbox for the verification link.';
        errorType = 'warning';
        showEmailVerificationRequired(email);
      } else if (error.errorCode === 'ACCOUNT_DEACTIVATED') {
        errorMessage = 'Your account has been deactivated. Please contact support.';
        errorType = 'error';
      } else if (error.errorCode === 'ACCOUNT_LOCKED' && error.lockoutInfo) {
        errorMessage = `Account temporarily locked. Try again in ${error.lockoutInfo.remainingMinutes} minutes.`;
        errorType = 'error';
        showAccountLockedMessage(error.lockoutInfo);
      } else if (error.message.includes('temporarily locked')) {
        errorMessage = 'Too many failed attempts. Please try again in 15 minutes.';
        errorType = 'error';
      } else {
        errorMessage = error.message;
      }
    }

    showEnhancedAlert(errorMessage, errorType);
    LoginAnimations.shake(document.getElementById('login-form'), 'normal');

  } finally {
    isLoading = false;
    setLoadingState(false);
  }
}

// ✅ ENHANCED success message - Works with LoginResponse DTO
function showEnhancedSuccessMessage(response) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">🎉 Welcome Back!</h3>
        <p class="text-gray-600 mb-2">${response.message || 'Login successful!'}</p>
        ${response.user ? `
          <div class="bg-blue-50 p-3 rounded-lg mb-4">
            <p class="text-sm text-gray-600">Welcome back,</p>
            <p class="font-semibold text-blue-600">${response.user.fullName || response.user.firstName}</p>
          </div>
        ` : ''}
      </div>

      ${response.nextSteps ? `
        <div class="space-y-4">
          <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <h4 class="font-semibold text-green-800 mb-2">🚀 ${response.nextSteps.welcomeMessage || 'Ready to Continue'}</h4>
            ${response.nextSteps.recommendedActions ? `
              <ul class="text-sm text-green-700 space-y-1 list-disc list-inside">
                ${response.nextSteps.recommendedActions.map(action => `<li>${action}</li>`).join('')}
              </ul>
            ` : ''}
            ${response.nextSteps.profileCompletion ? `
              <div class="mt-3 text-xs text-green-600">
                <p>Profile completion: ${response.nextSteps.profileCompletion.percentage}%</p>
                <p>${response.nextSteps.profileCompletion.suggestion}</p>
              </div>
            ` : ''}
          </div>

          <button id="continue-to-dashboard" class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200">
            Continue to Dashboard
          </button>
        </div>
      ` : `
        <button id="continue-to-dashboard" class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Continue to Dashboard
        </button>
      `}
    </div>
  `;

  document.body.appendChild(modal);

  // Handle continue button
  modal.querySelector('#continue-to-dashboard').addEventListener('click', () => {
    modal.remove();
    const redirectUrl = response.redirectUrl || '/dashboard';
    window.dispatchEvent(new CustomEvent('navigate', {
      detail: { view: redirectUrl.replace('/', '') || 'dashboard' }
    }));
  });

  // Auto close after 3 seconds
  setTimeout(() => {
    if (document.body.contains(modal)) {
      modal.remove();
      const redirectUrl = response.redirectUrl || '/dashboard';
      window.dispatchEvent(new CustomEvent('navigate', {
        detail: { view: redirectUrl.replace('/', '') || 'dashboard' }
      }));
    }
  }, 3000);
}

// ✅ NEW: Enhanced alert system
function showEnhancedAlert(message, type = 'info') {
  const alertContainer = document.createElement('div');
  alertContainer.className = 'fixed top-4 right-4 z-50 max-w-sm w-full';

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  alertContainer.innerHTML = `
    <div class="border-l-4 p-4 rounded-lg shadow-lg ${bgColors[type]} transform translate-x-full transition-transform duration-300">
      <div class="flex items-start">
        <span class="mr-2 text-lg">${icons[type]}</span>
        <p class="text-sm font-medium flex-1">${message}</p>
        <button class="ml-2 text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">×</button>
      </div>
    </div>
  `;

  document.body.appendChild(alertContainer);

  // Slide in
  setTimeout(() => {
    alertContainer.querySelector('div').classList.remove('translate-x-full');
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(alertContainer)) {
      alertContainer.remove();
    }
  }, 5000);
}

// ✅ NEW: Email verification required modal
function showEmailVerificationRequired(email) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-8 max-w-md w-full">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">📧</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Email Verification Required</h3>
        <p class="text-gray-600 mb-2">Please verify your email address before signing in.</p>
        <p class="text-sm text-gray-500">Check your inbox at <strong>${email}</strong></p>
      </div>

      <div class="space-y-3">
        <button id="resend-verification" class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          📤 Resend Verification Email
        </button>
        <button id="open-email" class="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200">
          📬 Open Email App
        </button>
        <button id="close-verification-modal" class="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors duration-200">
          Continue
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#resend-verification').addEventListener('click', async () => {
    try {
      const button = modal.querySelector('#resend-verification');
      button.disabled = true;
      button.innerHTML = '⏳ Sending...';

      await authService.resendVerificationEmail(email);

      showEnhancedAlert('Verification email resent successfully! Please check your inbox.', 'success');
      button.innerHTML = '✅ Sent!';

      setTimeout(() => {
        modal.remove();
      }, 2000);

    } catch (error) {
      console.error('Failed to resend verification:', error);
      showEnhancedAlert('Failed to resend email. Please try again.', 'error');
      const button = modal.querySelector('#resend-verification');
      button.disabled = false;
      button.innerHTML = '📤 Resend Verification Email';
    }
  });

  modal.querySelector('#open-email').addEventListener('click', () => {
    // Try to open common email apps
    const emailDomain = email.split('@')[1];
    let emailUrl = 'mailto:';

    if (emailDomain.includes('gmail')) {
      emailUrl = 'https://mail.google.com';
    } else if (emailDomain.includes('outlook') || emailDomain.includes('hotmail')) {
      emailUrl = 'https://outlook.live.com';
    } else if (emailDomain.includes('yahoo')) {
      emailUrl = 'https://mail.yahoo.com';
    }

    window.open(emailUrl, '_blank');
  });

  modal.querySelector('#close-verification-modal').addEventListener('click', () => {
    modal.remove();
  });
}

// ✅ NEW: Account locked message
function showAccountLockedMessage(lockoutInfo) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-8 max-w-md w-full">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">🔒</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Account Temporarily Locked</h3>
        <p class="text-gray-600 mb-4">Too many failed login attempts detected.</p>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-sm text-red-800 mb-2">
            <strong>Locked for:</strong> ${lockoutInfo.remainingMinutes} minutes
          </p>
          <p class="text-xs text-red-600">
            You can try again at ${new Date(lockoutInfo.unlockTime).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div class="space-y-3">
        <button id="forgot-password-locked" class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          🔑 Reset Password Instead
        </button>
        <button id="close-locked-modal" class="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors duration-200">
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#forgot-password-locked').addEventListener('click', () => {
    modal.remove();
    showForgotPasswordModal();
  });

  modal.querySelector('#close-locked-modal').addEventListener('click', () => {
    modal.remove();
  });
}

// ✅ ENHANCED forgot password functionality
function showForgotPasswordModal(initialEmail = '') {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-8 max-w-md w-full">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">🔑</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Reset Your Password</h3>
        <p class="text-gray-600">Enter your email address and we'll send you a password reset link.</p>
      </div>

      <form id="forgot-password-form" class="space-y-4">
        <div>
          <label for="forgot-email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            id="forgot-email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
            value="${initialEmail}"
            required
          />
        </div>

        <div class="flex space-x-3">
          <button type="submit" class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Send Reset Link
          </button>
          <button type="button" id="cancel-forgot" class="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = modal.querySelector('#forgot-email').value.trim();

    if (!email) {
      showEnhancedAlert('Please enter your email address', 'warning');
      return;
    }

    try {
      const submitButton = modal.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '⏳ Sending...';

      await authService.requestPasswordReset(email);

      showEnhancedAlert('Password reset link sent! Please check your email.', 'success');
      modal.remove();

    } catch (error) {
      console.error('Password reset failed:', error);
      showEnhancedAlert('Failed to send reset email. Please try again.', 'error');

      const submitButton = modal.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send Reset Link';
    }
  });

  modal.querySelector('#cancel-forgot').addEventListener('click', () => {
    modal.remove();
  });

  // Focus email input
  setTimeout(() => {
    modal.querySelector('#forgot-email').focus();
  }, 100);
}

// ✅ ENHANCED loading state management
function setLoadingState(loading) {
  const submitButton = document.getElementById('login-submit');
  const submitText = document.getElementById('submit-text');
  const overlay = document.getElementById('login-overlay');

  if (submitButton && submitText) {
    submitButton.disabled = loading;

    if (loading) {
      submitText.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Signing In...
      `;
    } else {
      submitText.textContent = 'Sign In';
    }
  }

  if (overlay) {
    if (loading) {
      overlay.classList.remove('opacity-0', 'invisible');
      overlay.classList.add('opacity-100', 'visible');
    } else {
      overlay.classList.add('opacity-0', 'invisible');
      overlay.classList.remove('opacity-100', 'visible');
    }
  }
}

// Password visibility toggle (enhanced)
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const toggleButton = document.getElementById('toggle-password');

  if (passwordInput && toggleButton) {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
    toggleButton.innerHTML = showPassword ? icons.eyeOff : icons.eye;
  }
}

// ✅ ENHANCED event listeners
export function attachLoginEventListeners() {
  console.log('🔗 Attaching enhanced login event listeners...');

  // Form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    console.log('✅ Enhanced login form listener attached');
  }

  // Password toggle
  const togglePassword = document.getElementById('toggle-password');
  if (togglePassword) {
    togglePassword.addEventListener('click', togglePasswordVisibility);
  }

  // Create account button
  const createAccount = document.getElementById('create-account');
  if (createAccount) {
    createAccount.addEventListener('click', () => {
      console.log('Navigating to signup page');
      window.dispatchEvent(new CustomEvent('navigate', {
        detail: { view: 'signup' }
      }));
    });
  }

  // Forgot password button
  const forgotPassword = document.getElementById('forgot-password');
  if (forgotPassword) {
    forgotPassword.addEventListener('click', () => {
      const currentEmail = document.getElementById('email').value.trim();
      showForgotPasswordModal(currentEmail);
    });
  }

  // Social login buttons
  const googleLogin = document.getElementById('google-login');
  if (googleLogin) {
    googleLogin.addEventListener('click', () => {
      showEnhancedAlert('Google OAuth integration coming soon!', 'info');
    });
  }

  const microsoftLogin = document.getElementById('microsoft-login');
  if (microsoftLogin) {
    microsoftLogin.addEventListener('click', () => {
      showEnhancedAlert('Microsoft OAuth integration coming soon!', 'info');
    });
  }

  // Enhanced real-time validation
  const fields = ['email', 'password'];

  fields.forEach(fieldName => {
    const element = document.getElementById(fieldName);
    if (element) {
      // Debounced validation on input
      let validationTimeout;
      element.addEventListener('input', () => {
        clearTimeout(validationTimeout);
        validationTimeout = setTimeout(() => {
          if (element.value.trim()) {
            validateField(fieldName, element.value);
          }
        }, 500);

        checkFormCompletion();
      });

      // Immediate validation on blur
      element.addEventListener('blur', () => {
        if (element.value.trim()) {
          validateField(fieldName, element.value);
        }
      });

      // Clear errors on focus
      element.addEventListener('focus', () => {
        clearFieldError(fieldName);
      });
    }
  });

  // Remember me checkbox
  const rememberCheckbox = document.getElementById('remember');
  if (rememberCheckbox) {
    rememberCheckbox.addEventListener('change', checkFormCompletion);
  }

  // Initial form state check
  checkFormCompletion();

  console.log('✅ All enhanced login event listeners attached successfully');
}

// ✅ ENHANCED form completion checker
function checkFormCompletion() {
  const email = document.getElementById('email')?.value.trim() || '';
  const password = document.getElementById('password')?.value || '';
  const submitButton = document.getElementById('login-submit');

  const allFilled = email.includes('@') && password.length > 0;

  if (submitButton) {
    submitButton.disabled = !allFilled || isLoading;

    // Visual feedback
    if (allFilled && !isLoading) {
      submitButton.classList.add('ring-2', 'ring-blue-300');
    } else {
      submitButton.classList.remove('ring-2', 'ring-blue-300');
    }
  }
}

// Initialize login page with enhanced features
export function initializeLogin(initialEmail = '') {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    appContainer.innerHTML = renderLoginPage(initialEmail);
    setTimeout(() => {
      attachLoginEventListeners();
      checkFormCompletion();

      // If there's an initial email, focus password field
      if (initialEmail) {
        const passwordField = document.getElementById('password');
        if (passwordField) {
          passwordField.focus();
        }
      }
    }, 100);
  }
}

// Enhanced CSS animations
const loginStyles = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}

@keyframes shake-light {
  0%, 100% { transform: translateX(0); }
  25%, 75% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
}

@keyframes shake-strong {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-12px); }
  20%, 40%, 60%, 80% { transform: translateX(12px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-shake-light {
  animation: shake-light 0.4s ease-in-out;
}

.animate-shake-strong {
  animation: shake-strong 0.6s ease-in-out;
}

/* Enhanced focus states */
.focus\\:ring-blue-500:focus {
  --tw-ring-color: rgb(59 130 246 / 0.5);
}

.focus\\:ring-red-500:focus {
  --tw-ring-color: rgb(239 68 68 / 0.5);
}

.focus\\:ring-green-500:focus {
  --tw-ring-color: rgb(34 197 94 / 0.5);
}
`;

// Inject enhanced CSS
if (typeof document !== 'undefined' && !document.getElementById('login-animations')) {
  const style = document.createElement('style');
  style.id = 'login-animations';
  style.textContent = loginStyles;
  document.head.appendChild(style);
}

// Export all functions
export {
  togglePasswordVisibility,
  LoginAnimations,
  showEnhancedAlert,
  showForgotPasswordModal
};
