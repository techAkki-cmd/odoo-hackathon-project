import './style.css'
import { authService } from './api/authService.js'

// Icons (simple SVG icons)
const icons = {
  eye: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
  </svg>`,
  eyeOff: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
  </svg>`,
  mail: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
  </svg>`,
  user: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>`,
  check: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
  </svg>`
}

// State management
let currentView = 'login';
let showPassword = false;
let isLoading = false;

// Router
function navigate(view) {
  currentView = view;
  render();
}

// Check for verification token in URL
function checkVerificationToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token && window.location.pathname.includes('verify')) {
    verifyAccount(token);
  }
}

// Render functions
function renderLogin() {
  return `
    <div class="min-h-screen bg-gradient-to-br from-odoo-50 to-blue-100 flex items-center justify-center p-4">
      <div class="card max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p class="text-gray-600">Sign in to your Odoo Hackathon account</p>
        </div>
        
        <form id="login-form" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                ${icons.mail}
              </div>
              <input type="email" id="login-email" class="input-field pl-10" placeholder="Enter your email" required>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input type="${showPassword ? 'text' : 'password'}" id="login-password" class="input-field pr-10" placeholder="Enter your password" required>
              <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                ${showPassword ? icons.eyeOff : icons.eye}
              </button>
            </div>
          </div>
          
          <div id="login-error" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"></div>
          
          <button type="submit" class="btn-primary w-full" ${isLoading ? 'disabled' : ''}>
            ${isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <span class="text-gray-600">Don't have an account? </span>
          <button onclick="navigate('register')" class="text-odoo-600 hover:text-odoo-700 font-medium">Sign Up</button>
        </div>
      </div>
    </div>
  `;
}

function renderRegister() {
  return `
    <div class="min-h-screen bg-gradient-to-br from-odoo-50 to-blue-100 flex items-center justify-center p-4">
      <div class="card max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Join Odoo Hackathon</h1>
          <p class="text-gray-600">Create your account to get started</p>
        </div>
        
        <form id="register-form" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input type="text" id="first-name" class="input-field" placeholder="John" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input type="text" id="last-name" class="input-field" placeholder="Doe" required>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                ${icons.mail}
              </div>
              <input type="email" id="register-email" class="input-field pl-10" placeholder="Enter your email" required>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input type="${showPassword ? 'text' : 'password'}" id="register-password" class="input-field pr-10" placeholder="Create a password" required minlength="6">
              <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                ${showPassword ? icons.eyeOff : icons.eye}
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">Must be at least 6 characters long</p>
          </div>
          
          <div id="register-error" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"></div>
          <div id="register-success" class="hidden bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"></div>
          
          <button type="submit" class="btn-primary w-full" ${isLoading ? 'disabled' : ''}>
            ${isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <span class="text-gray-600">Already have an account? </span>
          <button onclick="navigate('login')" class="text-odoo-600 hover:text-odoo-700 font-medium">Sign In</button>
        </div>
      </div>
    </div>
  `;
}

function renderDashboard() {
  const user = authService.getCurrentUser();
  return `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">Odoo Hackathon Dashboard</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">Welcome, ${user?.firstName}!</span>
              <button onclick="handleLogout()" class="btn-secondary">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      
      <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="card">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🎉 Welcome to the Hackathon!</h2>
          <p class="text-gray-600 mb-6">Your account has been successfully verified and you're ready to start building amazing things!</p>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex">
              <div class="text-green-400 mr-3">${icons.check}</div>
              <div>
                <h3 class="text-green-800 font-medium">Account Verified</h3>
                <p class="text-green-700 text-sm mt-1">You can now access all hackathon features and resources.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}

function renderVerificationSuccess() {
  return `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div class="card max-w-md w-full text-center">
        <div class="text-green-500 mx-auto mb-6">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Account Verified!</h1>
        <p class="text-gray-600 mb-8">Your account has been successfully verified. You can now sign in to access the hackathon platform.</p>
        <button onclick="navigate('login')" class="btn-primary w-full">Continue to Sign In</button>
      </div>
    </div>
  `;
}

// Event handlers
async function handleLogin(e) {
  e.preventDefault();
  isLoading = true;
  render();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    await authService.login({ email, password });
    navigate('dashboard');
  } catch (error) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = error.response?.data?.error || 'Login failed. Please try again.';
    errorDiv.classList.remove('hidden');
  } finally {
    isLoading = false;
    render();
  }
}

async function handleRegister(e) {
  e.preventDefault();
  isLoading = true;
  render();
  
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  try {
    const response = await authService.register({ firstName, lastName, email, password });
    
    const successDiv = document.getElementById('register-success');
    successDiv.textContent = response.message;
    successDiv.classList.remove('hidden');
    
    // Hide error if it was showing
    document.getElementById('register-error').classList.add('hidden');
    
    // Reset form
    document.getElementById('register-form').reset();
    
  } catch (error) {
    const errorDiv = document.getElementById('register-error');
    errorDiv.textContent = error.response?.data?.error || 'Registration failed. Please try again.';
    errorDiv.classList.remove('hidden');
    
    // Hide success if it was showing
    document.getElementById('register-success').classList.add('hidden');
  } finally {
    isLoading = false;
    render();
  }
}

async function verifyAccount(token) {
  try {
    await authService.verifyAccount(token);
    navigate('verification-success');
  } catch (error) {
    alert(error.response?.data?.error || 'Verification failed');
    navigate('login');
  }
}

function handleLogout() {
  authService.logout();
  navigate('login');
}

function togglePasswordVisibility() {
  showPassword = !showPassword;
  render();
}

// Main render function
function render() {
  let content = '';
  
  // Check if user is already authenticated
  if (authService.isUserAuthenticated() && currentView !== 'dashboard') {
    currentView = 'dashboard';
  }
  
  switch (currentView) {
    case 'login':
      content = renderLogin();
      break;
    case 'register':
      content = renderRegister();
      break;
    case 'dashboard':
      content = renderDashboard();
      break;
    case 'verification-success':
      content = renderVerificationSuccess();
      break;
    default:
      content = renderLogin();
  }
  
  document.querySelector('#app').innerHTML = content;
  
  // Add event listeners after rendering
  setTimeout(() => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }
    
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
      togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Make functions globally available
    window.navigate = navigate;
    window.handleLogout = handleLogout;
  }, 0);
}

// Initialize app
checkVerificationToken();
render();
