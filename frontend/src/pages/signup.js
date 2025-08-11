// src/signup.js - Enhanced for Perfect Backend Integration
import { icons, utils, CONFIG, createFloatingElements, debounce } from '../utils/common.js';
import { authService } from '../api/authService.js';

// State management
let showPassword = false;
let showConfirmPassword = false;
let isLoading = false;

// Perfect Animation class (unchanged - already perfect)
class SignupAnimations {
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
function validateName(name, type = 'first') {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: `${type} name is required` };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: `${type} name must be at least 2 characters` };
  }
  if (name.trim().length > 50) {
    return { isValid: false, message: `${type} name is too long (maximum 50 characters)` };
  }
  // Enhanced regex to match backend exactly
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name.trim())) {
    return { isValid: false, message: 'Only letters, spaces, hyphens, and apostrophes allowed' };
  }
  return { isValid: true, message: 'Valid name' };
}

function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return { isValid: false, message: 'Email address is required' };
  }
  // Enhanced email validation to match backend exactly
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  if (email.length > 255) {
    return { isValid: false, message: 'Email address is too long (maximum 255 characters)' };
  }
  return { isValid: true, message: 'Valid email' };
}

function validatePassword(password) {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long (maximum 128 characters)' };
  }

  // Enhanced password strength validation to match backend exactly
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[@$!%*?&]/.test(password);

  if (!hasLowercase || !hasUppercase || !hasNumbers || !hasSpecialChars) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    };
  }

  return { isValid: true, message: 'Strong password' };
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  return { isValid: true, message: 'Passwords match' };
}

// ✅ ENHANCED signup page renderer with better UX
export function renderSignupPage() {
  return `
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center p-6">
      ${createFloatingElements()}

      <!-- Enhanced Loading Overlay -->
      <div id="signup-overlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-500 ${isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'}">
        <div class="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm w-full mx-4">
          <div class="animate-spin w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-600 font-medium mb-2">Creating your account...</p>
          <p class="text-gray-500 text-sm">Please wait while we set up your rental management account</p>
        </div>
      </div>

      <div class="bg-white bg-opacity-90 rounded-xl shadow-xl max-w-lg w-full p-8 relative">
        <!-- Premium Gradient Overlay -->
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>

        <header class="text-center mb-8">
          <div class="inline-block p-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white mb-4">
            ${icons.rocket}
          </div>
          <h1 class="text-3xl font-bold text-gray-800">Join RentHub</h1>
          <p class="text-gray-600 mt-2">Your Ultimate Rental Management Platform</p>
        </header>

        <!-- ✅ ROLE SELECTION - INTEGRATED -->
        <div class="role-selection mb-6">
          <h3 class="text-lg font-semibold mb-4 text-center">I want to:</h3>
          <div class="grid gap-3">
            <label class="role-card border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-500 transition-all duration-200">
              <input type="radio" name="userRole" value="customer" class="hidden" checked>
              <div class="flex items-center">
                <div class="icon mr-4 text-2xl">🏠</div>
                <div>
                  <h4 class="font-bold text-gray-800">Rent Equipment/Property</h4>
                  <p class="text-sm text-gray-600">Browse and book rental items</p>
                </div>
              </div>
            </label>

            <label class="role-card border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-500 transition-all duration-200">
              <input type="radio" name="userRole" value="owner" class="hidden">
              <div class="flex items-center">
                <div class="icon mr-4 text-2xl">💼</div>
                <div>
                  <h4 class="font-bold text-gray-800">List My Equipment/Property</h4>
                  <p class="text-sm text-gray-600">Rent out my items and earn money</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Enhanced Form with Better Accessibility -->
        <form id="signup-form" class="space-y-6" novalidate>
          <!-- Name Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your first name"
                required
                maxlength="50"
                autocomplete="given-name"
              />
              <div id="firstName-error" class="text-red-500 text-xs mt-1 hidden flex items-center">
                <span class="mr-1">⚠️</span>
                <span class="error-text"></span>
              </div>
            </div>

            <div>
              <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your last name"
                required
                maxlength="50"
                autocomplete="family-name"
              />
              <div id="lastName-error" class="text-red-500 text-xs mt-1 hidden flex items-center">
                <span class="mr-1">⚠️</span>
                <span class="error-text"></span>
              </div>
            </div>
          </div>

          <!-- Email Field with Enhanced Validation -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
              required
              maxlength="255"
              autocomplete="email"
            />
            <div id="email-error" class="text-red-500 text-xs mt-1 hidden flex items-center">
              <span class="mr-1">⚠️</span>
              <span class="error-text"></span>
            </div>
            <!-- Email availability indicator -->
            <div id="email-availability" class="text-xs mt-1 hidden"></div>
          </div>

          <!-- ✅ LOCATION FIELD - INTEGRATED -->
          <div class="location-field">
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Location *
            </label>
            <div class="relative">
              <input type="text" name="location" id="location" placeholder="Enter your city or area"
                     class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
              <button type="button" id="detect-location"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800 transition-colors duration-200">
                📍 Detect
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">We'll show you nearby rental options</p>
            <div id="location-error" class="text-red-500 text-xs mt-1 hidden flex items-center">
              <span class="mr-1">⚠️</span>
              <span class="error-text"></span>
            </div>
          </div>

          <!-- ✅ BUSINESS FIELDS - INTEGRATED (Hidden by default) -->
          <div id="business-fields" class="hidden space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="font-semibold text-blue-800 mb-3">📋 Business Information</h4>
              <div class="space-y-4">
                <input type="text" name="businessName" id="businessName" placeholder="Business/Company Name"
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500">
                <input type="text" name="businessLicense" placeholder="Business License Number (Optional)"
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500">
                <select name="businessType" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500">
                  <option value="">Select Business Type</option>
                  <option value="equipment-rental">Equipment Rental</option>
                  <option value="property-rental">Property Rental</option>
                  <option value="vehicle-rental">Vehicle Rental</option>
                  <option value="individual">Individual Owner</option>
                </select>
              </div>
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
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12 transition-all duration-200"
                placeholder="Enter your password"
                required
                maxlength="128"
                autocomplete="new-password"
              />
              <button type="button" id="toggle-password" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors duration-200">
                ${icons.eye}
              </button>
            </div>
            <div id="password-error" class="text-red-500 text-xs mt-1 hidden flex items-center">
              <span class="mr-1">⚠️</span>
              <span class="error-text"></span>
            </div>
            <!-- Password strength indicator -->
            <div id="password-strength" class="mt-2 hidden">
              <div class="flex space-x-1 mb-2">
                <div class="h-2 flex-1 rounded-full bg-gray-200" id="strength-bar-1"></div>
                <div class="h-2 flex-1 rounded-full bg-gray-200" id="strength-bar-2"></div>
                <div class="h-2 flex-1 rounded-full bg-gray-200" id="strength-bar-3"></div>
                <div class="h-2 flex-1 rounded-full bg-gray-200" id="strength-bar-4"></div>
              </div>
              <p class="text-xs text-gray-600" id="strength-text">Password strength: Weak</p>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-1">
              Confirm Password *
            </label>
            <div class="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12 transition-all duration-200"
                placeholder="Confirm your password"
                required
                autocomplete="new-password"
              />
              <button type="button" id="toggle-confirm-password" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors duration-200">
                ${icons.eye}
              </button>
            </div>
            <div id="confirmPassword-error" class="text-red-500 text-xs mt-1 hidden flex items-center">
              <span class="mr-1">⚠️</span>
              <span class="error-text"></span>
            </div>
          </div>

          <!-- Enhanced Terms and Conditions -->
          <div class="flex items-start mt-4">
            <input type="checkbox" id="terms" name="terms" class="mt-1 mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" required />
            <label for="terms" class="text-sm text-gray-700 leading-relaxed">
              I agree to the
              <a href="#" class="text-purple-600 hover:text-purple-800 underline font-medium">Terms and Conditions</a>
              and
              <a href="#" class="text-purple-600 hover:text-purple-800 underline font-medium">Privacy Policy</a>
            </label>
          </div>

          <!-- Enhanced Submit Button -->
          <button
            type="submit"
            id="signup-submit"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold p-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
            disabled
          >
            <span id="submit-text">Create Account</span>
          </button>
        </form>

        <!-- ✅ TRUST SIGNALS - INTEGRATED -->
        <div class="trust-indicators mt-6 text-center">
          <div class="flex justify-center items-center space-x-6 text-sm text-gray-600">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span>Secure Payments</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Verified Owners</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75c0-.916-.126-1.802-.361-2.634z"></path>
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        <!-- Enhanced Login Link -->
        <div class="mt-6 text-center p-4 bg-gray-50 rounded-lg">
          <span class="text-gray-700">Already have an account?</span>
          <button type="button" id="switch-to-login" class="ml-2 text-purple-600 hover:text-purple-800 underline font-semibold transition-colors duration-200">
            Sign In Instead
          </button>
        </div>
      </div>
    </div>
  `;
}


// Add role selection to signup.js
const roleSelection = `
  <div class="role-selection mb-6">
    <h3 class="text-lg font-semibold mb-4">I want to:</h3>
    <div class="grid gap-4">
      <label class="role-card border-2 rounded-xl p-4 cursor-pointer hover:border-purple-500">
        <input type="radio" name="userRole" value="customer" class="hidden">
        <div class="flex items-center">
          <div class="icon mr-4">🏠</div>
          <div>
            <h4 class="font-bold">Rent Equipment/Property</h4>
            <p class="text-sm text-gray-600">Browse and book rental items</p>
          </div>
        </div>
      </label>

      <label class="role-card border-2 rounded-xl p-4 cursor-pointer hover:border-purple-500">
        <input type="radio" name="userRole" value="owner" class="hidden">
        <div class="flex items-center">
          <div class="icon mr-4">💼</div>
          <div>
            <h4 class="font-bold">List My Equipment/Property</h4>
            <p class="text-sm text-gray-600">Rent out my items and earn money</p>
          </div>
        </div>
      </label>
    </div>
  </div>
`;
// Add conditional business fields
const businessFields = `
  <div id="business-fields" class="hidden space-y-4">
    <input type="text" name="businessName" placeholder="Business/Company Name"
           class="w-full px-4 py-4 border border-gray-200 rounded-xl">
    <input type="text" name="businessLicense" placeholder="Business License Number (Optional)"
           class="w-full px-4 py-4 border border-gray-200 rounded-xl">
    <select name="businessType" class="w-full px-4 py-4 border border-gray-200 rounded-xl">
      <option value="">Select Business Type</option>
      <option value="equipment-rental">Equipment Rental</option>
      <option value="property-rental">Property Rental</option>
      <option value="vehicle-rental">Vehicle Rental</option>
      <option value="individual">Individual Owner</option>
    </select>
  </div>
`;
const trustSignals = `
  <div class="trust-indicators mt-6 text-center">
    <div class="flex justify-center items-center space-x-6 text-sm text-gray-600">
      <div class="flex items-center">
        <svg class="w-4 h-4 text-green-500 mr-1"><!-- Shield icon --></svg>
        <span>Secure Payments</span>
      </div>
      <div class="flex items-center">
        <svg class="w-4 h-4 text-green-500 mr-1"><!-- Verify icon --></svg>
        <span>Verified Owners</span>
      </div>
      <div class="flex items-center">
        <svg class="w-4 h-4 text-green-500 mr-1"><!-- Support icon --></svg>
        <span>24/7 Support</span>
      </div>
    </div>
  </div>
`;
// Add location field to signup
const locationField = `
  <div class="location-field">
    <label class="block text-sm font-semibold text-gray-700 mb-1">
      Location *
    </label>
    <div class="relative">
      <input type="text" name="location" placeholder="Enter your city or area"
             class="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500">
      <button type="button" id="detect-location"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800">
        📍 Detect
      </button>
    </div>
    <p class="text-xs text-gray-500 mt-1">We'll show you nearby rental options</p>
  </div>
`;


// ✅ ENHANCED field validation helpers
function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const inputElement = document.getElementById(fieldName);
  const errorTextElement = errorElement?.querySelector('.error-text');

  if (errorElement && inputElement && errorTextElement) {
    errorTextElement.textContent = message;
    errorElement.classList.remove('hidden');
    inputElement.classList.add('border-red-500', 'focus:ring-red-500');
    inputElement.classList.remove('border-green-500', 'focus:ring-purple-500');
  }
}

function clearFieldError(fieldName) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const inputElement = document.getElementById(fieldName);

  if (errorElement && inputElement) {
    errorElement.classList.add('hidden');
    inputElement.classList.remove('border-red-500', 'focus:ring-red-500');
    inputElement.classList.add('border-green-500', 'focus:ring-green-500');

    // Add success checkmark
    setTimeout(() => {
      inputElement.classList.remove('border-green-500', 'focus:ring-green-500');
      inputElement.classList.add('focus:ring-purple-500');
    }, 2000);
  }
}

function validateField(fieldName, value) {
  let validation;

  switch (fieldName) {
    case 'firstName':
      validation = validateName(value, 'First');
      break;
    case 'lastName':
      validation = validateName(value, 'Last');
      break;
    case 'email':
      validation = validateEmail(value);
      // Check email availability
      if (validation.isValid) {
        checkEmailAvailability(value);
      }
      break;
    case 'password':
      validation = validatePassword(value);
      updatePasswordStrength(value);
      break;
    case 'confirmPassword':
      const password = document.getElementById('password').value;
      validation = validateConfirmPassword(password, value);
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

// ✅ NEW: Email availability checker
async function checkEmailAvailability(email) {
  const availabilityElement = document.getElementById('email-availability');

  if (!availabilityElement) return;

  try {
    const response = await authService.checkEmailAvailability(email);

    if (response.available) {
      availabilityElement.innerHTML = '<span class="text-green-600">✅ Email is available</span>';
    } else {
      availabilityElement.innerHTML = '<span class="text-red-600">❌ Email is already registered</span>';
    }
    availabilityElement.classList.remove('hidden');

  } catch (error) {
    availabilityElement.classList.add('hidden');
  }
}

// ✅ NEW: Password strength indicator
function updatePasswordStrength(password) {
  const strengthElement = document.getElementById('password-strength');
  const strengthText = document.getElementById('strength-text');

  if (!strengthElement || !password) {
    strengthElement?.classList.add('hidden');
    return;
  }

  strengthElement.classList.remove('hidden');

  // Calculate strength
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password)
  };

  Object.values(checks).forEach(check => check && score++);

  // Update bars
  for (let i = 1; i <= 4; i++) {
    const bar = document.getElementById(`strength-bar-${i}`);
    if (bar) {
      if (i <= score) {
        bar.className = `h-2 flex-1 rounded-full ${getStrengthColor(score)}`;
      } else {
        bar.className = 'h-2 flex-1 rounded-full bg-gray-200';
      }
    }
  }

  // Update text
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-blue-600', 'text-green-600'];

  if (strengthText) {
    strengthText.textContent = `Password strength: ${strengthLabels[score] || 'Very Weak'}`;
    strengthText.className = `text-xs ${strengthColors[score] || 'text-red-600'}`;
  }
}

function getStrengthColor(score) {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  return colors[score] || 'bg-red-500';
}

// ✅ ENHANCED signup handler - Perfect backend integration
async function handleSignup(event) {
  event.preventDefault();

  if (isLoading) return;

  console.log('🚀 Enhanced signup initiated');

  // Get form data using CORRECT IDs that match backend RegisterRequest DTO
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const terms = document.getElementById('terms').checked;

  // Clear previous errors
  ['firstName', 'lastName', 'email', 'password', 'confirmPassword'].forEach(field => {
    clearFieldError(field);
  });

  // Validate all fields
  let isValid = true;

  if (!validateField('firstName', firstName)) isValid = false;
  if (!validateField('lastName', lastName)) isValid = false;
  if (!validateField('email', email)) isValid = false;
  if (!validateField('password', password)) isValid = false;
  if (!validateField('confirmPassword', confirmPassword)) isValid = false;

  // Check terms
  if (!terms) {
    showEnhancedAlert('Please agree to the Terms and Conditions to continue.', 'warning');
    isValid = false;
  }

  // If validation fails, shake form
  if (!isValid) {
    console.log('❌ Form validation failed');
    SignupAnimations.shake(document.getElementById('signup-form'));
    return;
  }

  // Prepare signup data - EXACTLY matches backend RegisterRequest DTO
  const signupData = {
      firstName,
      lastName,
      email,
      password,
      userRole: document.querySelector('input[name="userRole"]:checked')?.value || 'customer',
      location: document.getElementById('location')?.value.trim(),
      // Business fields (if owner)
      ...(document.querySelector('input[name="userRole"]:checked')?.value === 'owner' && {
        businessName: document.getElementById('businessName')?.value.trim(),
        businessLicense: document.querySelector('input[name="businessLicense"]')?.value.trim(),
        businessType: document.querySelector('select[name="businessType"]')?.value
      })
    };

  console.log('📝 Signup data prepared for backend:', {
    firstName: signupData.firstName,
    lastName: signupData.lastName,
    email: signupData.email,
    password: '***' // Never log actual password
  });

  // Set loading state
  isLoading = true;
  setLoadingState(true);

  try {
    console.log('📤 Sending registration request to backend...');

    // Call the registration service - matches backend POST /api/auth/register
    const response = await authService.register(signupData);

    console.log('✅ Registration response received:', response);

    // Handle different response scenarios based on RegisterResponse DTO
    if (response.success) {
      console.log('🎉 Registration successful!');
      showEnhancedSuccessMessage(response);
    } else {
      throw new Error(response.message || 'Registration failed');
    }

  } catch (error) {
    console.error('❌ Registration failed:', error);

    // Enhanced error handling based on backend error codes
    let errorMessage = 'Registration failed. Please try again.';
    let errorType = 'error';

    if (error.message) {
      if (error.message.includes('Email already registered') || error.message.includes('EMAIL_EXISTS')) {
        errorMessage = 'This email is already registered. Would you like to sign in instead?';
        errorType = 'warning';
        showEmailExistsOptions(email);
      } else if (error.message.includes('VALIDATION_ERROR')) {
        errorMessage = 'Please check your input and try again.';
        errorType = 'warning';
      } else {
        errorMessage = error.message;
      }
    }

    showEnhancedAlert(errorMessage, errorType);
    SignupAnimations.shake(document.getElementById('signup-form'), 'normal');

  } finally {
    isLoading = false;
    setLoadingState(false);
  }
}

// ✅ ENHANCED success message - Works with RegisterResponse DTO
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
        <h3 class="text-xl font-bold text-gray-900 mb-2">🎉 Account Created Successfully!</h3>
        <p class="text-gray-600 mb-2">${response.message || 'Welcome to Odoo Hackathon!'}</p>
        ${response.email ? `
          <div class="bg-blue-50 p-3 rounded-lg mb-4">
            <p class="text-sm text-gray-600">Verification email sent to:</p>
            <p class="font-semibold text-blue-600">${response.email}</p>
          </div>
        ` : ''}
      </div>

      ${response.nextSteps ? `
        <div class="space-y-4">
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h4 class="font-semibold text-yellow-800 mb-2">📧 ${response.nextSteps.checkEmail || 'Next Steps'}</h4>
            <p class="text-sm text-yellow-700 mb-2">${response.nextSteps.verificationInstructions || ''}</p>
            ${response.nextSteps.troubleshooting ? `
              <details class="mt-2">
                <summary class="text-xs font-medium text-yellow-800 cursor-pointer">Can't find the email?</summary>
                <ul class="text-xs text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                  ${response.nextSteps.troubleshooting.commonIssues?.map(issue => `<li>${issue}</li>`).join('') || ''}
                </ul>
              </details>
            ` : ''}
          </div>

          <div class="flex space-x-3">
            <button id="resend-verification" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              📤 Resend Email
            </button>
            <button id="close-success-modal" class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200">
              Continue
            </button>
          </div>
        </div>
      ` : `
        <button id="close-success-modal" class="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200">
          Continue to Login
        </button>
      `}
    </div>
  `;

  document.body.appendChild(modal);

  // Enhanced resend functionality
  const resendButton = modal.querySelector('#resend-verification');
  if (resendButton) {
    resendButton.addEventListener('click', async () => {
      try {
        resendButton.disabled = true;
        resendButton.innerHTML = '⏳ Sending...';

        await authService.resendVerificationEmail(response.email);

        showEnhancedAlert('Verification email resent successfully! Please check your inbox.', 'success');
        resendButton.innerHTML = '✅ Sent!';

        setTimeout(() => {
          resendButton.disabled = false;
          resendButton.innerHTML = '📤 Resend Email';
        }, 3000);

      } catch (error) {
        console.error('Failed to resend verification:', error);
        showEnhancedAlert('Failed to resend email. Please try again.', 'error');
        resendButton.disabled = false;
        resendButton.innerHTML = '📤 Resend Email';
      }
    });
  }

  // Handle close button
  modal.querySelector('#close-success-modal').addEventListener('click', () => {
    modal.remove();
    // Navigate to login page
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'login' } }));
  });
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
        <p class="text-sm font-medium">${message}</p>
        <button class="ml-auto text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">×</button>
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
    alertContainer.remove();
  }, 5000);
}

// ✅ NEW: Email exists options
function showEmailExistsOptions(email) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-8 max-w-md w-full">
      <div class="text-center mb-6">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">⚠️</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Email Already Registered</h3>
        <p class="text-gray-600 mb-2">An account with <strong>${email}</strong> already exists.</p>
      </div>

      <div class="space-y-3">
        <button id="goto-login" class="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200">
          Sign In Instead
        </button>
        <button id="forgot-password" class="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200">
          Forgot Password?
        </button>
        <button id="close-email-modal" class="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors duration-200">
          Try Different Email
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#goto-login').addEventListener('click', () => {
    modal.remove();
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'login', email } }));
  });

  modal.querySelector('#forgot-password').addEventListener('click', () => {
    modal.remove();
    window.dispatchEvent(new CustomEvent('navigate', { detail: { view: 'forgot-password', email } }));
  });

  modal.querySelector('#close-email-modal').addEventListener('click', () => {
    modal.remove();
    document.getElementById('email').focus();
  });
}

// ✅ ENHANCED loading state management
function setLoadingState(loading) {
  const submitButton = document.getElementById('signup-submit');
  const submitText = document.getElementById('submit-text');
  const overlay = document.getElementById('signup-overlay');

  if (submitButton && submitText) {
    submitButton.disabled = loading;

    if (loading) {
      submitText.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Creating Account...
      `;
    } else {
      submitText.textContent = 'Create Account';
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

// Password visibility toggles (unchanged - already perfect)
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const toggleButton = document.getElementById('toggle-password');

  if (passwordInput && toggleButton) {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
    toggleButton.innerHTML = showPassword ? icons.eyeOff : icons.eye;
  }
}

function toggleConfirmPasswordVisibility() {
  const passwordInput = document.getElementById('confirmPassword');
  const toggleButton = document.getElementById('toggle-confirm-password');

  if (passwordInput && toggleButton) {
    showConfirmPassword = !showConfirmPassword;
    passwordInput.type = showConfirmPassword ? 'text' : 'password';
    toggleButton.innerHTML = showConfirmPassword ? icons.eyeOff : icons.eye;
  }
}

// ✅ ENHANCED event listeners
export function attachSignupEventListeners() {
  console.log('🔗 Attaching enhanced signup event listeners...');

  // Form submission
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
    console.log('✅ Enhanced signup form listener attached');
  }

  // Password toggles
  const togglePassword = document.getElementById('toggle-password');
  if (togglePassword) {
    togglePassword.addEventListener('click', togglePasswordVisibility);
  }

  const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', toggleConfirmPasswordVisibility);
  }

  // Switch to login
  const switchToLogin = document.getElementById('switch-to-login');
  if (switchToLogin) {
    switchToLogin.addEventListener('click', () => {
      console.log('Navigating to login page');
      window.dispatchEvent(new CustomEvent('navigate', {
        detail: { view: 'login' }
      }));
    });
  }

  const roleCards = document.querySelectorAll('input[name="userRole"]');
    roleCards.forEach(card => {
      card.addEventListener('change', (e) => {
        handleRoleSelection(e.target.value);
        updateUIForRole(e.target.value);
      });
    });
const detectLocationBtn = document.getElementById('detect-location');
  if (detectLocationBtn) {
    detectLocationBtn.addEventListener('click', detectUserLocation);
  }

  // Enhanced real-time validation
  const fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];

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
        // Hide email availability on focus
        if (fieldName === 'email') {
          document.getElementById('email-availability')?.classList.add('hidden');
        }
      });
    }
  });

  // Terms checkbox
  const termsCheckbox = document.getElementById('terms');
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', checkFormCompletion);
  }

  // Initial form state check
  checkFormCompletion();

  console.log('✅ All enhanced signup event listeners attached successfully');
}
function handleRoleSelection(role) {
  const businessFields = document.getElementById('business-fields');
  const submitButton = document.getElementById('signup-submit');
  const submitText = document.getElementById('submit-text');

  if (role === 'owner') {
    businessFields.classList.remove('hidden');
    submitText.textContent = 'Start Earning with RentHub';
  } else {
    businessFields.classList.add('hidden');
    submitText.textContent = 'Start Renting with RentHub';
  }

  // Update visual selection
  document.querySelectorAll('.role-card').forEach(card => {
    card.classList.remove('border-purple-500', 'bg-purple-50');
    card.classList.add('border-gray-200');
  });

  const selectedCard = document.querySelector(`input[value="${role}"]`).closest('.role-card');
  selectedCard.classList.add('border-purple-500', 'bg-purple-50');
  selectedCard.classList.remove('border-gray-200');
}

function updateUIForRole(role) {
  const header = document.querySelector('header h1');
  if (role === 'owner') {
    header.textContent = 'Start Your Rental Business';
  } else {
    header.textContent = 'Find Perfect Rentals';
  }
}

function detectUserLocation() {
  const locationInput = document.getElementById('location');
  const detectBtn = document.getElementById('detect-location');

  if ('geolocation' in navigator) {
    detectBtn.textContent = '⏳';
    detectBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // You can integrate with a geocoding service here
          locationInput.value = 'Location detected'; // Simplified for hackathon
          detectBtn.textContent = '✅';
          setTimeout(() => {
            detectBtn.textContent = '📍 Detect';
            detectBtn.disabled = false;
          }, 2000);
        } catch (error) {
          detectBtn.textContent = '❌';
          setTimeout(() => {
            detectBtn.textContent = '📍 Detect';
            detectBtn.disabled = false;
          }, 2000);
        }
      },
      (error) => {
        detectBtn.textContent = '❌';
        setTimeout(() => {
          detectBtn.textContent = '📍 Detect';
          detectBtn.disabled = false;
        }, 2000);
      }
    );
  }
}
// ✅ ENHANCED form completion checker
function checkFormCompletion() {
  const firstName = document.getElementById('firstName')?.value.trim() || '';
  const lastName = document.getElementById('lastName')?.value.trim() || '';
  const email = document.getElementById('email')?.value.trim() || '';
  const password = document.getElementById('password')?.value || '';
  const confirmPassword = document.getElementById('confirmPassword')?.value || '';
  const terms = document.getElementById('terms')?.checked || false;
  const submitButton = document.getElementById('signup-submit');

  const allFilled = firstName.length >= 2 &&
                   lastName.length >= 2 &&
                   email.includes('@') &&
                   password.length >= 8 &&
                   confirmPassword === password &&
                   terms;

  if (submitButton) {
    submitButton.disabled = !allFilled || isLoading;

    // Visual feedback
    if (allFilled && !isLoading) {
      submitButton.classList.add('ring-2', 'ring-purple-300');
    } else {
      submitButton.classList.remove('ring-2', 'ring-purple-300');
    }
  }
}

// Initialize signup page (unchanged)
export function initializeSignup() {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    appContainer.innerHTML = renderSignupPage();
    setTimeout(() => {
      attachSignupEventListeners();
      checkFormCompletion();
    }, 100);
  }
}

// Enhanced CSS animations (includes new animations)
const signupStyles = `
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
.focus\\:ring-purple-500:focus {
  --tw-ring-color: rgb(168 85 247 / 0.5);
}

.focus\\:ring-red-500:focus {
  --tw-ring-color: rgb(239 68 68 / 0.5);
}

.focus\\:ring-green-500:focus {
  --tw-ring-color: rgb(34 197 94 / 0.5);
}
`;

// Inject enhanced CSS
if (typeof document !== 'undefined' && !document.getElementById('signup-animations')) {
  const style = document.createElement('style');
  style.id = 'signup-animations';
  style.textContent = signupStyles;
  document.head.appendChild(style);
}

// Export all functions
export {
  handleSignup,
  SignupAnimations,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  showEnhancedAlert
};
