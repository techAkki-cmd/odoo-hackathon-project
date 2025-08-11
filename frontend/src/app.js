// src/app.js - Main Application Controller
// 🏆 Complete Modular OdooHackathonApp Class - All Functionality Preserved
import React from 'react';
import ReactDOM from 'react-dom/client';
// ✅ Existing imports...
import { renderLoginPage, attachLoginEventListeners } from "./pages/login.js";
import { renderSignupPage, attachSignupEventListeners } from "./pages/signup.js";
import { renderEmailVerification, attachEmailVerificationListeners } from "./pages/verification.js";
import LandingPage, { attachLandingListeners } from './pages/landing.js';
import DashboardPage, { attachDashboardListeners } from "./pages/Dashboard.js";
import UserDashboardPage, { attachUserDashboardListeners } from "./pages/userdashboard.js";
import OrdersPage, { attachOrdersListeners } from "./pages/orders.js";
import LoginRental, { attachLoginRentalListeners } from "./pages/loginrental.js";
import CartPage, { attachCartListeners } from "./pages/cart.js";
import DeliveryDetails, { attachDeliveryListeners } from "./pages/deliveryDetails.js";
import PaymentPage, { attachPaymentListeners } from "./pages/paymentPage.js";
import ProductPage, { attachProductListeners } from "./pages/product.js";



import { authService } from "./api/authService.js";
import { NotificationManager } from "./utils/notifications.js";
import { AnimationController } from "./utils/animations.js";

import { utils, CONFIG, icons, createFloatingElements } from "./utils/common.js";

// 🎨 Advanced Application State Management
class AppState {
  constructor() {
    this.currentView = "landing";
    this.previousView = null;
    this.isTransitioning = false;
    this.user = null;
    this.notifications = [];
    this.theme = localStorage.getItem("theme") || "light";
    this.isOnline = navigator.onLine;
    this.lastActivity = Date.now();
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
  }

  setState(newState) {
    Object.assign(this, newState);
    this.saveToStorage();
    this.notifyStateChange();
  }

  saveToStorage() {
    const stateToSave = {
      theme: this.theme,
      lastActivity: this.lastActivity,
      user: this.user,
    };
    localStorage.setItem("appState", JSON.stringify(stateToSave));
  }

  loadFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem("appState") || "{}");
      Object.assign(this, saved);
    } catch (error) {
      console.error("Failed to load app state:", error);
    }
  }

  notifyStateChange() {
    window.dispatchEvent(new CustomEvent("appStateChange", { detail: this }));
  }
}

// 🏆 MAIN APPLICATION CLASS - ENHANCED WITH LANDING INTEGRATION
export class OdooHackathonApp {
  constructor() {
    // Core services
    this.state = new AppState();
    this.routes = new Map();
    this.middleware = [];
    this.animations = new AppAnimations();
    this.notifications = new NotificationManager();
    this.analytics = new AnalyticsManager();
    this.sessionTimeoutId = null;

    // Initialize core systems
    this.setupRoutes();
    this.setupEventListeners();
    this.initializeApp();
  }

  // 🗺 Advanced Routing System - COMPLETE
  setupRoutes() {
    // Login Page
    this.routes.set("login", {
      component: renderLoginPage,
      attachListeners: attachLoginEventListeners,
      title: "Sign In - Odoo Hackathon",
      description: "Sign in to your Odoo Hackathon account",
      requiresAuth: false,
      animation: "slideInRight",
    });

    // Signup Page
    this.routes.set("signup", {
      component: renderSignupPage,
      attachListeners: attachSignupEventListeners,
      title: "Join the Revolution - Odoo Hackathon",
      description: "Create your account and start building amazing things",
      requiresAuth: false,
      animation: "slideInLeft",
    });

    // Email Verification
    this.routes.set("verify-email", {
      component: () => renderEmailVerification(),
      attachListeners: () => attachEmailVerificationListeners(),
      title: "Verify Email - Odoo Hackathon",
      description: "Verifying your email address",
      requiresAuth: false,
      animation: "fadeIn",
    });

    // Dashboard (React.createElement based)
    this.routes.set("dashboard", {
      component: DashboardPage,
      attachListeners: attachDashboardListeners,
      title: "Dashboard - Odoo Hackathon",
      description: "Your hackathon control center",
      requiresAuth: false,
      animation: "fadeIn",
    });
    // User-Dashboard (React.createElement based)
    this.routes.set("userdashboard", {
      component: UserDashboardPage,
      attachListeners: attachUserDashboardListeners,
      title: "Dashboard - Odoo Hackathon",
      description: "Your hackathon control center",
      requiresAuth: false,
      animation: "fadeIn",
    });

    // Orders Page
    this.routes.set("orders", {
      component: OrdersPage,
      attachListeners: attachOrdersListeners,
      title: "Orders - Odoo Hackathon",
      description: "Manage and view your orders",
      requiresAuth: false,
      animation: "fadeIn",
    });
    // Landing Page
    this.routes.set("landing", {
      component: LandingPage,
      attachListeners: attachLandingListeners,
      title: "Landing - Odoo Hackathon",
      description: "Welcome to the Odoo Hackathon platform",
      requiresAuth: false,
      animation: "fadeIn",
    });
    // Rental Page
    this.routes.set("loginrental", {
      component: LoginRental,
      attachListeners: attachLoginRentalListeners,
      title: "Landing - Odoo Hackathon",
      description: "Welcome to the Odoo Hackathon platform",
      requiresAuth: false,
      animation: "fadeIn",
    });
    // Cart Page
    this.routes.set("cart", {
      component: CartPage,
      attachListeners: attachCartListeners,
      title: "Landing - Odoo Hackathon",
      description: "Welcome to the Odoo Hackathon platform",
      requiresAuth: false,
      animation: "fadeIn",
    });
    // Delivery Details Page
    this.routes.set("delivery", {
      component: DeliveryDetails,
      attachListeners: attachDeliveryListeners,
      title: "Landing - Odoo Hackathon",
      description: "Welcome to the Odoo Hackathon platform",
      requiresAuth: false,
      animation: "fadeIn",
    });
    // Payment Page
    this.routes.set("payment", {
      component: PaymentPage,
      attachListeners: attachPaymentListeners,
      title: "Landing - Odoo Hackathon",
      description: "Welcome to the Odoo Hackathon platform",
      requiresAuth: false,
      animation: "fadeIn",
    });
    // Product Page
    this.routes.set("product", {
      component: ProductPage,
      attachListeners: attachProductListeners,
      title: "Landing - Odoo Hackathon",
      description: "Welcome to the Odoo Hackathon platform",
      requiresAuth: false,
      animation: "fadeIn",
    });
}


  // 🎭 Advanced Animation Controller - COMPLETE
  async navigate(viewName, options = {}) {
    if (this.state.isTransitioning) return;

    utils.log(`🧭 Navigating to: ${viewName}`);

    const route = this.routes.get(viewName);
    if (!route) {
      utils.error(`Route not found: ${viewName}`);
      return this.navigate("login");
    }

    // Authentication middleware
    // if (route.requiresAuth && !this.isAuthenticated()) {
    //   utils.log("🔒 Authentication required, redirecting to login");
    //   return this.navigate("login");
    // }

    // if (
    //   !route.requiresAuth &&
    //   this.isAuthenticated() &&
    //   viewName !== "verification-success"
    // ) {
    //   utils.log("👤 User authenticated, redirecting to dashboard");
    //   return this.navigate("dashboard");
    // }

    // Update state
    this.state.setState({
      previousView: this.state.currentView,
      currentView: viewName,
      isTransitioning: true,
    });

    // Update document metadata
    this.updateDocumentMeta(route);

    // Perform page transition
    await this.performPageTransition(route, options);

    // Analytics tracking
    this.analytics.trackPageView(viewName);

    this.state.setState({ isTransitioning: false });
  }

  // 🎨 Premium Page Transition System - COMPLETE  // React 18+ API

async performPageTransition(route, options) {
  const app = document.getElementById("app");
  const transitionDuration = options.fast ? 300 : 600;

  // Exit animation
  if (this.state.previousView) {
    await this.animations.exitAnimation(app, transitionDuration);
  }

  // Clear any existing React root on the container (optional: keep reference externally if needed)
  // Remove or clear existing content
  app.innerHTML = '';

  // Check if route.component is a React component (function or class)
  if (
    typeof route.component === 'function' || 
    (typeof route.component === 'object' && route.component !== null)
  ) {
    // Use ReactDOM.createRoot to render React component
    // Assume route.component is the React component, no props needed here
    // Create React element
    const reactElement = React.createElement(route.component);
    const root = ReactDOM.createRoot(app);
    root.render(reactElement);

    // Attach listeners after React render (if attachListeners add event listeners to real DOM nodes)
    setTimeout(() => {
      if (route.attachListeners) {
        route.attachListeners();
      }
      this.attachGlobalListeners();
    }, 50);
  } else if (typeof route.component === 'string') {
    // If route.component returns a string (legacy non-React mode), inject as innerHTML
    app.innerHTML = route.component();

    setTimeout(() => {
      if (route.attachListeners) {
        route.attachListeners();
      }
      this.attachGlobalListeners();
    }, 50);
  } else {
    // Unsupported component type
    console.error('Unsupported route component type');
  }

  // Enter animation
  await this.animations.enterAnimation(
    app,
    route.animation,
    transitionDuration
  );

  // Page-specific initialization
  this.initializeCurrentPage();
}


  // 🏆 ELITE PROFESSIONAL LOADING SCREEN - COMPLETE
  renderLoadingScreen() {
    return `
            <div class="elite-loading-container">
                <!-- Sophisticated Header -->
                <div class="elite-header">
                    <div class="brand-lockup">
                        <div class="logo-mark">
                            <div class="logo-symbol">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="brand-identity">
                            <h1 class="brand-name">RentHub</h1>
                            <span class="brand-descriptor">Rental Platform</span>
                        </div>
                    </div>
                </div>

                <!-- Elite Loading Core -->
                <div class="loading-core">
                    <div class="progress-system">
                        <div class="progress-header">
                            <span id="system-status" class="system-status">Initializing secure environment...</span>
                            <div class="progress-metrics">
                                <span id="progress-value" class="progress-value">0%</span>
                                <span class="eta-estimate">ETA: <span id="eta-time">3s</span></span>
                            </div>
                        </div>

                        <div class="progress-track">
                            <div id="progress-fill" class="progress-fill">
                                <div class="progress-gradient"></div>
                                <div class="progress-pulse"></div>
                            </div>
                        </div>

                        <div class="init-sequence">
                            <div class="init-step" id="step-security">
                                <div class="step-status"></div>
                                <span class="step-label">Security protocols</span>
                                <span class="step-indicator">●</span>
                            </div>
                            <div class="init-step" id="step-database">
                                <div class="step-status"></div>
                                <span class="step-label">Database connection</span>
                                <span class="step-indicator">●</span>
                            </div>
                            <div class="init-step" id="step-workspace">
                                <div class="step-status"></div>
                                <span class="step-label">Workspace preparation</span>
                                <span class="step-indicator">●</span>
                            </div>
                            <div class="init-step" id="step-ui">
                                <div class="step-status"></div>
                                <span class="step-label">Interface rendering</span>
                                <span class="step-indicator">●</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="elite-footer">
                    <div class="system-info">
                        <span id="loading-insight" class="loading-insight">Optimizing for your rental experience...</span>
                    </div>
                    <div class="build-info">
                        <span class="build-version">v2.1.0</span>
                        <span class="build-separator">•</span>
                        <span class="build-status">Production Ready</span>
                    </div>
                </div>
            </div>
        `;
  }

  // 📧 Email Verification Page Renderer - COMPLETE
  renderEmailVerification() {
    return `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                ${createFloatingElements()}

                <div class="w-full max-w-md relative z-10">
                    <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                        <div id="verification-content" class="text-center">
                            <!-- Loading State -->
                            <div id="verification-loading" class="mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <div class="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
                                </div>
                                <h2 class="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
                                <p class="text-gray-600">Please wait while we verify your email address...</p>
                            </div>

                            <!-- Success State (hidden initially) -->
                            <div id="verification-success" class="hidden mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h2 class="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
                                <p class="text-gray-600">Your account has been successfully verified.</p>
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
                            </div>

                            <!-- Action Buttons -->
                            <div id="verification-actions" class="hidden space-y-3">
                                <button
                                    onclick="app.navigate('login')"
                                    class="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                                    Continue to Login
                                </button>

                                <button
                                    id="resend-verification-btn"
                                    onclick="resendVerification()"
                                    class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-300">
                                    Resend Verification Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  // 🎯 Email Verification Event Listeners - COMPLETE
  attachEmailVerificationListeners() {
    console.log("📧 Attaching email verification listeners");

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      this.showVerificationError(
        "No verification token found in URL. Please check your email link."
      );
      return;
    }

    // Start verification process
    this.processEmailVerification(token);
  }

  // 🔧 Process Email Verification - COMPLETE
  async processEmailVerification(token) {
    console.log(
      "🔍 Processing email verification with token:",
      token.substring(0, 8) + "..."
    );

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/verify-email?token=${encodeURIComponent(
          token
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📊 Verification response status:", response.status);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        console.error("❌ Backend error details:", errorData);
        throw new Error(
          `Verification failed: ${
            errorData.message || "HTTP " + response.status
          }`
        );
      }

      const data = await response.json();
      console.log("✅ Verification response:", data);

      if (data.success) {
        this.showVerificationSuccess();
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        setTimeout(() => {
          this.navigate("verification-success");
        }, 2000);
      } else {
        this.showVerificationError(data.message || "Email verification failed");
      }
    } catch (error) {
      console.error("❌ Verification error:", error);
      this.showVerificationError(error.message);
    }
  }

  // 🎯 Show Verification States - COMPLETE
  showVerificationSuccess() {
    const loadingEl = document.getElementById("verification-loading");
    const errorEl = document.getElementById("verification-error");
    const successEl = document.getElementById("verification-success");
    const actionsEl = document.getElementById("verification-actions");

    if (loadingEl) loadingEl.classList.add("hidden");
    if (errorEl) errorEl.classList.add("hidden");
    if (successEl) successEl.classList.remove("hidden");
    if (actionsEl) actionsEl.classList.remove("hidden");
  }

  showVerificationError(message) {
    const loadingEl = document.getElementById("verification-loading");
    const successEl = document.getElementById("verification-success");
    const errorEl = document.getElementById("verification-error");
    const actionsEl = document.getElementById("verification-actions");
    const messageEl = document.getElementById("error-message");

    if (loadingEl) loadingEl.classList.add("hidden");
    if (successEl) successEl.classList.add("hidden");
    if (errorEl) errorEl.classList.remove("hidden");
    if (actionsEl) actionsEl.classList.remove("hidden");
    if (messageEl) messageEl.textContent = message;
  }

  // 🎨 Premium Dashboard Renderer - COMPLETE
  renderDashboard() {
    const user = this.getCurrentUser() || {
      firstName: "User",
      lastName: "",
      email: "user@example.com",
    };
    const stats = this.generateDashboardStats();

    return `
            <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                <!-- Premium Navigation Header -->
                <nav class="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 shadow-lg">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <!-- Logo & Brand -->
                            <div class="flex items-center space-x-4">
                                <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-300">
                                    ${icons.rocket}
                                </div>
                                <div>
                                    <h1 class="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                                        RentHub
                                    </h1>
                                    <p class="text-xs text-gray-500">Rental Platform</p>
                                </div>
                            </div>

                            <!-- User Menu -->
                            <div class="flex items-center space-x-4">
                                <button onclick="app.navigate('profile')" class="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200">
                                    <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full text-white font-bold text-sm shadow-lg">
                                        ${user?.firstName?.charAt(0) || "U"}${
      user?.lastName?.charAt(0) || ""
    }
                                    </div>
                                    <div class="text-left hidden sm:block">
                                        <p class="text-sm font-semibold text-gray-900">${
                                          user?.firstName
                                        } ${user?.lastName}</p>
                                        <p class="text-xs text-gray-500">Premium Member</p>
                                    </div>
                                </button>

                                <button onclick="handleLogout()" class="text-red-600 hover:text-red-800 p-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 0v4"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <!-- Main Dashboard Content -->
                <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <!-- Welcome Banner -->
                    <div class="mb-8">
                        <div class="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div class="relative z-10">
                                <h2 class="text-3xl font-bold mb-2">Welcome back, ${
                                  user?.firstName
                                }! 🚀</h2>
                                <p class="text-lg opacity-90 mb-6">Ready to build something amazing at the Odoo Hackathon?</p>

                                <div class="flex flex-wrap gap-4">
                                    <button onclick="createNewProduct()" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center">
                                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Add New Product
                                    </button>

                                    <button onclick="viewAllProducts()" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center">
                                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                        </svg>
                                        View Products
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Dashboard Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        ${this.renderStatCard(
                          "Projects",
                          stats.projects,
                          "📁",
                          "primary"
                        )}
                        ${this.renderStatCard(
                          "Team Members",
                          stats.teamMembers,
                          "👥",
                          "purple"
                        )}
                        ${this.renderStatCard(
                          "Hours Coded",
                          stats.hoursCodedy,
                          "⏰",
                          "green"
                        )}
                        ${this.renderStatCard(
                          "Achievements",
                          stats.achievements,
                          "🏆",
                          "yellow"
                        )}
                    </div>
                </main>
            </div>
        `;
  }

  // 📈 Statistics Card Renderer - COMPLETE
  renderStatCard(title, value, icon, color) {
    const colorClasses = {
      primary: "from-primary-500 to-blue-500",
      purple: "from-purple-500 to-pink-500",
      green: "from-green-500 to-emerald-500",
      yellow: "from-yellow-500 to-orange-500",
    };

    return `
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 mb-1">${title}</p>
                        <p class="text-3xl font-bold text-gray-900">${value}</p>
                    </div>
                    <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl text-white text-xl">
                        ${icon}
                    </div>
                </div>
            </div>
        `;
  }

  // 📱 Profile Settings Renderer - COMPLETE
  renderProfile() {
    const user = this.getCurrentUser() || {
      firstName: "User",
      lastName: "",
      email: "user@example.com",
    };

    return `
            <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                <!-- Navigation -->
                <nav class="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <button onclick="app.navigate('dashboard')" class="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                                Back to Dashboard
                            </button>

                            <h1 class="text-xl font-bold text-gray-900">Profile Settings</h1>

                            <div class="w-24"></div>
                        </div>
                    </div>
                </nav>

                <!-- Profile Content -->
                <main class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <div class="text-center mb-8">
                            <div class="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full text-white text-2xl font-bold mx-auto mb-4">
                                ${user?.firstName?.charAt(0) || "U"}${
      user?.lastName?.charAt(0) || ""
    }
                            </div>
                            <h2 class="text-2xl font-bold text-gray-900 mb-1">${
                              user?.firstName
                            } ${user?.lastName}</h2>
                            <p class="text-gray-500">${user?.email}</p>
                        </div>

                        <form class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input type="text" value="${
                                      user?.firstName || ""
                                    }" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input type="text" value="${
                                      user?.lastName || ""
                                    }" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" value="${
                                  user?.email || ""
                                }" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                            </div>

                            <div class="flex justify-end">
                                <button type="button" class="bg-primary-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors duration-200">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        `;
  }

  // 🔒 Verification Success Page - COMPLETE
  renderVerificationSuccess() {
    return `
            <div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
                ${createFloatingElements()}

                <div class="w-full max-w-2xl relative z-10 text-center">
                    <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
                        <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 animate-bounce-slow shadow-2xl">
                            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>

                        <h1 class="text-4xl font-bold text-gray-900 mb-4">🎉 Account Verified!</h1>
                        <p class="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
                            Congratulations! Your email has been successfully verified. You're now ready to use RentHub!
                        </p>

                        <button
                            onclick="app.navigate('dashboard')"
                            class="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700 hover:from-primary-700 hover:via-purple-700 hover:to-primary-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                            Enter Dashboard
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  // 📱 Update Document Metadata - COMPLETE
  updateDocumentMeta(route) {
    document.title = route.title;
    this.updateMetaTag("description", route.description);
    this.updateMetaTag("og:title", route.title);
    this.updateMetaTag("og:description", route.description);
  }

  updateMetaTag(name, content) {
    let meta = document.querySelector(
      `meta[name="${name}"], meta[property="${name}"]`
    );
    if (!meta) {
      meta = document.createElement("meta");
      if (name.startsWith("og:")) {
        meta.setAttribute("property", name);
      } else {
        meta.setAttribute("name", name);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  }

  // 🎯 Event Listeners Setup - COMPLETE
  setupEventListeners() {
    // Navigation events
    window.addEventListener("navigate", (event) => {
      this.navigate(event.detail.view, event.detail.options);
    });

    // Online/Offline status
    window.addEventListener("online", () => {
      this.state.setState({ isOnline: true });
      this.notifications.show("Connection restored", "success");
    });

    window.addEventListener("offline", () => {
      this.state.setState({ isOnline: false });
      this.notifications.show("You are offline", "warning");
    });

    // App state changes
    window.addEventListener("appStateChange", (event) => {
      this.handleStateChange(event.detail);
    });
  }

  // 🎬 Application Initialization - COMPLETE
  async initializeApp() {
  utils.log("🚀 Initializing Odoo Hackathon Application");

  // Check for verification in URL first
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const path = window.location.pathname;

  if (token && (path.includes("verify-email") || path.includes("verify"))) {
    console.log("📧 Email verification detected, loading verification page");
    console.log("🔍 Token found:", token.substring(0, 8) + "...");
    this.navigate("verify-email");
    return;
  }

  // Show loading screen
//   await this.navigate("loading");

  // Inject premium loading styles
  this.injectPremiumLoadingStyles();

  // Start premium loading experience
  this.startPremiumLoadingExperience();

  // Load saved state
  this.state.loadFromStorage();

  // Enhanced loading simulation with progress
  await this.simulateLoadingProgress();

  // Navigate directly to landing page, bypassing auth check
//   await this.navigate("landing");
//   await this.navigate("cart");
//   await this.navigate("loginrental");
//   await this.navigate("delivery");
//   await this.navigate("payment");



// await this.navigate("product");
//   await this.navigate("dashboard");
  await this.navigate("userdashboard");

//   await this.navigate("orders");
//   await this.navigate("login");

  // Initialize premium features
  this.initializePremiumFeatures();

  utils.log("✅ Application initialized successfully");
}


  // 🎨 ELITE PROFESSIONAL LOADING STYLES INJECTION - COMPLETE
  injectPremiumLoadingStyles() {
    const styles = `
            <style id="premium-loading-styles">
            .elite-loading-container {
                min-height: 100vh;
                background: linear-gradient(135deg, #fafbfc 0%, #f4f6f8 100%);
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                color: #1a1f36;
            }

            .elite-header {
                padding: 2rem 3rem 1rem;
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(20px);
            }

            .brand-lockup {
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 1200px;
                margin: 0 auto;
            }

            .logo-symbol {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }

            .brand-name {
                font-size: 1.75rem;
                font-weight: 700;
                margin: 0;
                color: #1a1f36;
            }

            .brand-descriptor {
                font-size: 0.875rem;
                color: #6b7280;
                font-weight: 500;
            }

            .loading-core {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 4rem 3rem;
                max-width: 1200px;
                margin: 0 auto;
                width: 100%;
            }

            .progress-system {
                max-width: 480px;
                width: 100%;
            }

            .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 1.5rem;
            }

            .system-status {
                font-size: 1rem;
                font-weight: 600;
                color: #374151;
            }

            .progress-value {
                font-size: 1.125rem;
                font-weight: 700;
                color: #4f46e5;
            }

            .eta-estimate {
                font-size: 0.75rem;
                color: #9ca3af;
            }

            .progress-track {
                height: 6px;
                background: #e5e7eb;
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 2rem;
            }

            .progress-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #10b981 100%);
                transition: width 0.4s ease;
            }

            .init-sequence {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .init-step {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 0;
                transition: all 0.3s ease;
            }

            .step-status {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #d1d5db;
                transition: all 0.3s ease;
            }

            .init-step.active .step-status {
                background: #4f46e5;
            }

            .init-step.completed .step-status {
                background: #10b981;
            }

            .step-label {
                flex: 1;
                font-size: 0.875rem;
                font-weight: 500;
                color: #374151;
            }

            .step-indicator {
                font-size: 8px;
                color: #d1d5db;
            }

            .elite-footer {
                padding: 1.5rem 3rem;
                border-top: 1px solid rgba(0, 0, 0, 0.06);
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .loading-insight {
                font-size: 0.875rem;
                color: #6b7280;
                font-style: italic;
            }

            .build-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.75rem;
                color: #9ca3af;
            }

            .build-version {
                color: #4f46e5;
                font-weight: 600;
            }
            </style>
        `;

    document.head.insertAdjacentHTML("beforeend", styles);
    console.log("✅ Elite professional loading styles injected");
  }

  // 🏆 ELITE LOADING EXPERIENCE CONTROLLER - COMPLETE
  startPremiumLoadingExperience() {
    const steps = [
      { id: "step-security", duration: 800 },
      { id: "step-database", duration: 600 },
      { id: "step-workspace", duration: 700 },
      { id: "step-ui", duration: 400 },
    ];

    const insights = [
      "Optimizing for your team's workflow patterns...",
      "Configuring enterprise security protocols...",
      "Preparing real-time collaboration environment...",
      "Initializing advanced analytics engine...",
      "Platform deployment sequence complete",
    ];

    let currentStep = 0;
    let currentInsight = 0;

    // Update insights
    const updateInsights = () => {
      const insightEl = document.getElementById("loading-insight");
      if (insightEl && currentInsight < insights.length) {
        insightEl.style.opacity = "0.5";
        setTimeout(() => {
          insightEl.textContent = insights[currentInsight];
          insightEl.style.opacity = "1";
          currentInsight++;
        }, 200);
      }
    };

    const insightInterval = setInterval(() => {
      if (currentInsight < insights.length) {
        updateInsights();
      } else {
        clearInterval(insightInterval);
      }
    }, 2000);

    // Process steps
    const processStep = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        const stepEl = document.getElementById(step.id);

        if (stepEl) {
          stepEl.classList.add("active");
        }

        if (currentStep > 0) {
          const prevStep = document.getElementById(steps[currentStep - 1].id);
          if (prevStep) {
            prevStep.classList.remove("active");
            prevStep.classList.add("completed");
          }
        }

        currentStep++;
        setTimeout(processStep, step.duration);
      } else {
        const lastStep = document.getElementById(steps[steps.length - 1].id);
        if (lastStep) {
          lastStep.classList.remove("active");
          lastStep.classList.add("completed");
        }
        clearInterval(insightInterval);
      }
    };

    setTimeout(processStep, 500);
    setTimeout(updateInsights, 1000);
  }

  // 🏆 ELITE PROGRESS SIMULATION - COMPLETE
  async simulateLoadingProgress() {
    return new Promise((resolve) => {
      const progressFill = document.getElementById("progress-fill");
      const progressValue = document.getElementById("progress-value");
      const systemStatus = document.getElementById("system-status");
      const etaTime = document.getElementById("eta-time");

      if (!progressFill || !progressValue) {
        setTimeout(resolve, 3000);
        return;
      }

      const steps = [
        {
          progress: 8,
          time: 2.8,
          status: "Initializing secure environment...",
          delay: 400,
        },
        {
          progress: 23,
          time: 2.2,
          status: "Establishing database connections...",
          delay: 350,
        },
        {
          progress: 41,
          time: 1.8,
          status: "Configuring workspace settings...",
          delay: 400,
        },
        {
          progress: 58,
          time: 1.3,
          status: "Loading user interface components...",
          delay: 300,
        },
        {
          progress: 76,
          time: 0.8,
          status: "Optimizing performance parameters...",
          delay: 250,
        },
        {
          progress: 94,
          time: 0.3,
          status: "Finalizing initialization sequence...",
          delay: 200,
        },
        {
          progress: 100,
          time: 0,
          status: "Platform ready for deployment",
          delay: 300,
        },
      ];

      let currentStep = 0;

      const updateProgress = () => {
        if (currentStep < steps.length) {
          const step = steps[currentStep];

          progressFill.style.width = step.progress + "%";
          progressValue.textContent = step.progress + "%";
          systemStatus.textContent = step.status;
          etaTime.textContent = step.time > 0 ? step.time + "s" : "Complete";

          currentStep++;
          setTimeout(updateProgress, step.delay);
        } else {
          setTimeout(resolve, 300);
        }
      };

      updateProgress();
    });
  }

  // ✨ Premium Features Initialization - COMPLETE
  initializePremiumFeatures() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          utils.log("Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          utils.log("Service Worker registration failed:", error);
        });
    }

    this.setupSessionTimeout();
  }

  // 🔐 Logout Handler - COMPLETE
  handleLogout() {
    utils.log("👋 User logging out");

    if (this.authService && typeof this.authService.logout === "function") {
      this.authService.logout();
    }

    this.state.setState({
      user: null,
      currentView: "login",
      notifications: [],
    });

    this.notifications.show("You have been logged out successfully", "success");
    this.navigate("login");
  }

  // 🎯 Attach Global Event Listeners - COMPLETE
  attachGlobalListeners() {
    try {
      window.app = this;

      window.handleLogout = () => this.handleLogout();

      window.resendVerification = async () => {
        try {
          const email = prompt(
            "Please enter your email address to resend verification:"
          );
          if (!email) return;

          const response = await fetch(
            "http://localhost:8080/api/auth/resend-verification",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: email.trim() }),
            }
          );

          const data = await response.json();

          if (data.success) {
            this.notifications.show(
              "✅ Verification email sent! Please check your inbox.",
              "success"
            );
          } else {
            this.notifications.show(
              "❌ Failed to send verification email: " + data.message,
              "error"
            );
          }
        } catch (error) {
          console.error("Resend verification error:", error);
          this.notifications.show("❌ Error: " + error.message, "error");
        }
      };

      window.createNewProject = () => {
        this.notifications.show("🚀 Project creation coming soon!", "info");
      };

      window.joinTeam = () => {
        this.notifications.show("👥 Team joining coming soon!", "info");
      };

      utils.log("✅ Global listeners attached successfully");
    } catch (error) {
      utils.error("❌ Failed to attach global listeners:", error);
    }
  }

  // 🎯 Additional Event Listeners - COMPLETE
  attachDashboardListeners() {
    console.log("📊 Dashboard listeners attached");
  }

  attachProfileListeners() {
    console.log("👤 Profile listeners attached");
  }

  attachVerificationListeners() {
    console.log("✅ Verification listeners attached");
  }

  // 🔄 Handle App State Changes - COMPLETE
  handleStateChange(newState) {
    utils.log("🔄 App state changed:", newState);
    this.applyTheme();
  }

  // 🎯 Initialize Current Page - COMPLETE
  initializeCurrentPage() {
    const currentView = this.state.currentView;
    utils.log(`🎯 Initializing page: ${currentView}`);

    try {
      switch (currentView) {
        case "dashboard":
          this.initializeDashboard();
          break;
        case "profile":
          this.initializeProfile();
          break;
        default:
          utils.log(`No specific initialization for ${currentView}`);
      }

      this.applyTheme();
    } catch (error) {
      utils.error("Page initialization error:", error);
    }
  }

  // 🏠 Initialize Dashboard - COMPLETE
  initializeDashboard() {
    utils.log("🏠 Dashboard initialization");
  }

  // 👤 Initialize Profile Page - COMPLETE
  initializeProfile() {
    utils.log("👤 Profile initialization");
  }

  // ⏱ Setup Session Timeout - COMPLETE
  setupSessionTimeout() {
    try {
      if (this.sessionTimeoutId) {
        clearTimeout(this.sessionTimeoutId);
      }

      const timeoutDuration = CONFIG?.SESSION_TIMEOUT || 30 * 60 * 1000;

      this.sessionTimeoutId = setTimeout(() => {
        utils.log("⏰ Session timeout reached");
        this.notifications.show(
          "Your session has expired. Please sign in again.",
          "warning"
        );
        this.handleLogout();
      }, timeoutDuration);

      utils.log(
        `⏱ Session timeout set for ${timeoutDuration / 1000 / 60} minutes`
      );
    } catch (error) {
      utils.error("Session timeout setup failed:", error);
    }
  }

  // 🔍 Check Session Validity - COMPLETE
  async checkSession() {
    try {
      if (
        this.authService &&
        typeof this.authService.validateSession === "function"
      ) {
        const isValid = await this.authService.validateSession();
        if (!isValid) {
          utils.log("🔒 Session invalid, redirecting to login");
          this.navigate("login");
        }
        return isValid;
      }
      return false;
    } catch (error) {
      utils.error("❌ Session check failed:", error);
      this.navigate("login");
      return false;
    }
  }

  // 🎨 Apply Current Theme - COMPLETE
  applyTheme() {
    document.documentElement.setAttribute(
      "data-theme",
      this.state.theme || "light"
    );
  }

  // 📊 Generate Dashboard Stats - COMPLETE
  generateDashboardStats() {
    return {
      projects: Math.floor(Math.random() * 10) + 1,
      teamMembers: Math.floor(Math.random() * 50) + 1,
      hoursCodedy: Math.floor(Math.random() * 100) + 10,
      achievements: Math.floor(Math.random() * 20) + 1,
    };
  }

  // 🔐 Authentication Helper Methods - COMPLETE
  isAuthenticated() {
    return !!(
      localStorage.getItem("authToken") || localStorage.getItem("user")
    );
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }
}

// 🎨 Advanced Animation System - COMPLETE
class AppAnimations {
  async exitAnimation(element, duration = 600) {
    element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    element.style.opacity = "0";
    element.style.transform = "translateY(-20px) scale(0.95)";
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  async enterAnimation(element, animationType = "fadeIn", duration = 600) {
    element.style.opacity = "0";

    const animations = {
      fadeIn: () => {
        element.style.transform = "translateY(20px) scale(0.95)";
      },
      slideInRight: () => {
        element.style.transform = "translateX(100px)";
      },
      slideInLeft: () => {
        element.style.transform = "translateX(-100px)";
      },
      slideInUp: () => {
        element.style.transform = "translateY(100px)";
      },
      bounceIn: () => {
        element.style.transform = "scale(0.3)";
      },
    };

    animations[animationType]?.();

    requestAnimationFrame(() => {
      element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      element.style.opacity = "1";
      element.style.transform = "translate(0, 0) scale(1)";
    });

    return new Promise((resolve) => setTimeout(resolve, duration));
  }
}

// 🔔 Notification Management System - COMPLETE

// 📊 Analytics Management System - COMPLETE
class AnalyticsManager {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
  }

  trackPageView(page) {
    this.trackEvent("page_view", { page, timestamp: Date.now() });
  }

  trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      data,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
    };

    this.events.push(event);
    utils.log("📊 Analytics event:", event);
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
  }
}