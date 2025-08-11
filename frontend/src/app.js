// src/app.js - Complete Application Controller with Landing Integration
// 🏆 Enhanced OdooHackathonApp Class - Perfect RentHub Integration

import { renderLoginPage, attachLoginEventListeners } from './pages/login.js';
import { renderSignupPage, attachSignupEventListeners } from './pages/signup.js';
import { renderLandingPage, attachLandingListeners } from './pages/landing.js';
import { authService } from './api/authService.js';
import { renderEmailVerification, attachEmailVerificationListeners } from './pages/verification.js';
import { NotificationManager } from './utils/notifications.js';
import { AnimationController } from './utils/animations.js';

import { utils, CONFIG, icons, createFloatingElements } from './utils/common.js';

// 🎨 Advanced Application State Management
class AppState {
    constructor() {
        this.currentView = 'landing'; // ✅ Start with landing page
        this.previousView = null;
        this.isTransitioning = false;
        this.user = null;
        this.notifications = [];
        this.theme = localStorage.getItem('theme') || 'light';
        this.isOnline = navigator.onLine;
        this.lastActivity = Date.now();
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.products = []; // ✅ Added for product management
        this.platformStats = null; // ✅ Added for landing page stats
        this.showDashboard = false;
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
            products: this.products,
            showDashboard: this.showDashboard
        };
        try {
            localStorage.setItem('appState', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Failed to save app state:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = JSON.parse(localStorage.getItem('appState') || '{}');
            Object.assign(this, saved);
        } catch (error) {
            console.error('Failed to load app state:', error);
        }
    }

    notifyStateChange() {
        window.dispatchEvent(new CustomEvent('appStateChange', { detail: this }));
    }

    reset() {
        this.currentView = 'landing';
        this.previousView = null;
        this.isTransitioning = false;
        this.user = null;
        this.notifications = [];
        this.showDashboard = false;
        this.saveToStorage();
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

        // ✅ Added API endpoints
        this.apiEndpoints = {
            products: 'http://localhost:8080/api/products',
            auth: 'http://localhost:8080/api/auth'
        };

        // Initialize core systems
        this.setupRoutes();
        this.setupEventListeners();
        this.initializeApp();
    }

    // 🗺️ Enhanced Routing System with Landing Integration
    setupRoutes() {
        // ✅ Landing Page Route (Entry Point)
        this.routes.set('landing', {
            component: renderLandingPage,
            attachListeners: attachLandingListeners,
            title: 'RentHub - Your Ultimate Rental Platform',
            description: 'Discover and rent amazing products from vehicles to electronics',
            requiresAuth: false,
            animation: 'fadeIn'
        });

        this.routes.set('login', {
            component: renderLoginPage,
            attachListeners: attachLoginEventListeners,
            title: 'Sign In - RentHub',
            description: 'Sign in to your RentHub account',
            requiresAuth: false,
            animation: 'slideInRight'
        });

        this.routes.set('signup', {
            component: renderSignupPage,
            attachListeners: attachSignupEventListeners,
            title: 'Join RentHub - Start Renting Today',
            description: 'Create your account and start renting',
            requiresAuth: false,
            animation: 'slideInLeft'
        });

        this.routes.set('verify-email', {
            component: () => renderEmailVerification(),
            attachListeners: () => attachEmailVerificationListeners(),
            title: 'Verify Email - RentHub',
            description: 'Verifying your email address',
            requiresAuth: false,
            animation: 'fadeIn'
        });

        this.routes.set('verification-success', {
            component: () => this.renderVerificationSuccess(),
            attachListeners: () => this.attachVerificationListeners(),
            title: 'Account Verified - RentHub',
            description: 'Your account has been successfully verified',
            requiresAuth: false,
            animation: 'bounceIn'
        });

        // Dashboard Routes (All aliases)
        const dashboardConfig = {
            component: () => this.renderDashboard(),
            attachListeners: () => this.attachDashboardListeners(),
            title: 'Dashboard - RentHub',
            description: 'Your rental management dashboard',
            requiresAuth: true,
            animation: 'fadeIn'
        };

        ['dashboard', 'customer-dashboard', 'buyer-dashboard'].forEach(route => {
            this.routes.set(route, dashboardConfig);
        });

        this.routes.set('profile', {
            component: () => this.renderProfile(),
            attachListeners: () => this.attachProfileListeners(),
            title: 'Profile Settings - RentHub',
            description: 'Manage your account settings',
            requiresAuth: true,
            animation: 'slideInUp'
        });

        this.routes.set('loading', {
            component: () => this.renderLoadingScreen(),
            attachListeners: () => {},
            title: 'Loading - RentHub',
            description: 'Please wait...',
            requiresAuth: false,
            animation: 'fadeIn'
        });
    }

    // 🎬 Enhanced Application Initialization
    async initializeApp() {
        utils.log('🚀 Initializing RentHub Application with Landing Integration');

        // Check for verification in URL first
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const path = window.location.pathname;

        if (token && (path.includes('verify-email') || path.includes('verify'))) {
            console.log('📧 Email verification detected, loading verification page');
            this.navigate('verify-email');
            return;
        }

        // Show loading screen briefly
        this.navigate('loading');
        this.injectPremiumLoadingStyles();
        this.startPremiumLoadingExperience();

        // Load saved state
        this.state.loadFromStorage();

        // Check authentication
        const isAuthenticated = this.isAuthenticated();

        // Enhanced loading simulation
        await this.simulateLoadingProgress();

        // ✅ Enhanced Navigation Logic
        if (isAuthenticated) {
            this.state.user = this.getCurrentUser();
            this.state.setState({ showDashboard: true });
            this.navigate('dashboard');
        } else {
            // Always start with landing page for unauthenticated users
            this.navigate('landing');
        }

        // Initialize premium features
        this.initializePremiumFeatures();

        utils.log('✅ RentHub Application initialized successfully');
    }

    // 🎭 Enhanced Navigation with Landing Integration
    async navigate(viewName, options = {}) {
        if (this.state.isTransitioning) {
            console.log('🚫 Navigation blocked: transition in progress');
            return;
        }

        console.log(`🧭 Navigating to: ${viewName}`);

        const route = this.routes.get(viewName);
        if (!route) {
            console.error(`❌ Route not found: ${viewName}`);
            // Enhanced fallback logic
            if (this.isAuthenticated()) {
                console.log('🔄 Fallback: Redirecting authenticated user to dashboard');
                return this.navigate('dashboard');
            } else {
                console.log('🔄 Fallback: Redirecting to landing');
                return this.navigate('landing');
            }
        }

        // Enhanced auth check
        if (route.requiresAuth) {
            const isAuth = this.isAuthenticated();
            console.log(`🔒 Auth check for ${viewName}:`, isAuth);

            if (!isAuth) {
                console.log('🔒 Authentication required, redirecting to landing');
                this.notifications.show('Please sign in to access this page', 'warning');
                return this.navigate('landing');
            }
        }

        // Auto-redirect authenticated users from public pages
        if (!route.requiresAuth && this.isAuthenticated() &&
            !['landing', 'verification-success'].includes(viewName)) {
            console.log('👤 User authenticated, checking redirect');
            if (viewName === 'login' || viewName === 'signup') {
                return this.navigate('dashboard');
            }
        }

        // Prevent infinite loops
        if (this.state.currentView === viewName) {
            console.log(`🔄 Already on ${viewName}, skipping navigation`);
            return;
        }

        // Update state
        this.state.setState({
            previousView: this.state.currentView,
            currentView: viewName,
            isTransitioning: true
        });

        // Update document metadata
        this.updateDocumentMeta(route);

        // Perform page transition
        await this.performPageTransition(route, options);

        // Analytics tracking
        this.analytics.trackPageView(viewName);

        this.state.setState({ isTransitioning: false });
    }

    // 🎨 Premium Page Transition System
    async performPageTransition(route, options) {
        const app = document.getElementById('app');
        const transitionDuration = options.fast ? 300 : 600;

        // Exit animation
        if (this.state.previousView) {
            await this.animations.exitAnimation(app, transitionDuration);
        }

        // Render new content
        app.innerHTML = route.component();

        // Update page theme if needed
        this.applyTheme();

        // Attach event listeners
        setTimeout(() => {
            route.attachListeners();
            this.attachGlobalListeners();
        }, 50);

        // Enter animation
        await this.animations.enterAnimation(app, route.animation, transitionDuration);

        // Page-specific initialization
        this.initializeCurrentPage();
    }

    // 📱 Update Document Metadata
    updateDocumentMeta(route) {
        document.title = route.title;
        this.updateMetaTag('description', route.description);
        this.updateMetaTag('og:title', route.title);
        this.updateMetaTag('og:description', route.description);
    }

    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            if (name.startsWith('og:')) {
                meta.setAttribute('property', name);
            } else {
                meta.setAttribute('name', name);
            }
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    // 🎯 Event Listeners Setup
    setupEventListeners() {
        // Navigation events
        window.addEventListener('navigate', (event) => {
            this.navigate(event.detail.view, event.detail.options);
        });

        // Online/Offline status
        window.addEventListener('online', () => {
            this.state.setState({ isOnline: true });
            this.notifications.show('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.state.setState({ isOnline: false });
            this.notifications.show('You are offline', 'warning');
        });

        // App state changes
        window.addEventListener('appStateChange', (event) => {
            this.handleStateChange(event.detail);
        });
    }

    // 🔐 Enhanced Logout Handler
    handleLogout() {
        console.log('👋 User logging out');

        // Clear all authentication data
        const authKeys = [
            'authToken', 'token', 'access_token', 'accessToken',
            'refreshToken', 'refresh_token', 'user', 'userData'
        ];

        authKeys.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });

        // Call auth service logout if available
        if (authService && typeof authService.logout === 'function') {
            authService.logout();
        }

        this.state.setState({
            user: null,
            currentView: 'landing',
            notifications: [],
            showDashboard: false
        });

        if (this.sessionTimeoutId) {
            clearTimeout(this.sessionTimeoutId);
            this.sessionTimeoutId = null;
        }

        this.notifications.show('You have been logged out successfully', 'success');
        this.navigate('landing');
    }

    // 🎯 Enhanced Global Event Listeners
    attachGlobalListeners() {
        try {
            window.app = this;

            // Navigation functions
            window.handleLogout = () => this.handleLogout();
            window.navigateToLanding = () => this.navigate('landing');
            window.navigateToSignup = () => this.navigate('signup');
            window.navigateToLogin = () => this.navigate('login');
            window.navigateToDashboard = () => this.navigate('dashboard');

            // Auth service integration
            window.authService = authService;
            window.performLogin = async (credentials) => await authService.login(credentials);
            window.checkEmailAvailability = async (email) => await authService.checkEmailAvailability(email);

            // API helpers
            window.loadProducts = () => this.loadProductsFromAPI();
            window.loadPlatformStats = () => this.loadPlatformStats();

            window.resendVerification = async () => {
                try {
                    const email = prompt('Please enter your email address to resend verification:');
                    if (!email) return;

                    const response = await fetch(`${this.apiEndpoints.auth}/resend-verification`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email.trim() })
                    });

                    const data = await response.json();

                    if (data.success) {
                        this.notifications.show('✅ Verification email sent! Please check your inbox.', 'success');
                    } else {
                        this.notifications.show('❌ Failed to send verification email: ' + data.message, 'error');
                    }
                } catch (error) {
                    console.error('Resend verification error:', error);
                    this.notifications.show('❌ Error: ' + error.message, 'error');
                }
            };

            console.log('✅ Enhanced global listeners attached successfully');

        } catch (error) {
            console.error('❌ Failed to attach global listeners:', error);
        }
    }

    // 🏆 ELITE PROFESSIONAL LOADING SCREEN
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

    // 🎨 Premium Dashboard Renderer
    renderDashboard() {
        const user = this.getCurrentUser() || { firstName: 'User', lastName: '', email: 'user@example.com' };
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
                                        ${user?.firstName?.charAt(0) || 'U'}${user?.lastName?.charAt(0) || ''}
                                    </div>
                                    <div class="text-left hidden sm:block">
                                        <p class="text-sm font-semibold text-gray-900">${user?.firstName} ${user?.lastName}</p>
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
                                <h2 class="text-3xl font-bold mb-2">Welcome back, ${user?.firstName}! 🚀</h2>
                                <p class="text-lg opacity-90 mb-6">Ready to manage your rental business?</p>

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
                        ${this.renderStatCard('My Products', stats.products, '📁', 'primary')}
                        ${this.renderStatCard('Active Rentals', stats.activeRentals, '🔄', 'purple')}
                        ${this.renderStatCard('Total Earnings', stats.earnings, '💰', 'green')}
                        ${this.renderStatCard('Customer Rating', stats.rating, '⭐', 'yellow')}
                    </div>
                </main>
            </div>
        `;
    }

    // 📈 Statistics Card Renderer
    renderStatCard(title, value, icon, color) {
        const colorClasses = {
            primary: 'from-primary-500 to-blue-500',
            purple: 'from-purple-500 to-pink-500',
            green: 'from-green-500 to-emerald-500',
            yellow: 'from-yellow-500 to-orange-500'
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

    // 📱 Profile Settings Renderer
    renderProfile() {
        const user = this.getCurrentUser() || { firstName: 'User', lastName: '', email: 'user@example.com' };

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
                                ${user?.firstName?.charAt(0) || 'U'}${user?.lastName?.charAt(0) || ''}
                            </div>
                            <h2 class="text-2xl font-bold text-gray-900 mb-1">${user?.firstName} ${user?.lastName}</h2>
                            <p class="text-gray-500">${user?.email}</p>
                        </div>

                        <form class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input type="text" value="${user?.firstName || ''}" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input type="text" value="${user?.lastName || ''}" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" value="${user?.email || ''}" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
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

    // 🔒 Verification Success Page
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

    // 🔄 Handle App State Changes
    handleStateChange(newState) {
        console.log('🔄 App state changed:', newState);
        this.applyTheme();
    }

    // 🎯 Initialize Current Page
    initializeCurrentPage() {
        const currentView = this.state.currentView;
        console.log(`🎯 Initializing page: ${currentView}`);

        try {
            switch (currentView) {
                case 'dashboard':
                    this.initializeDashboard();
                    break;
                case 'profile':
                    this.initializeProfile();
                    break;
                case 'landing':
                    this.initializeLanding();
                    break;
                default:
                    console.log(`No specific initialization for ${currentView}`);
            }

            this.applyTheme();
        } catch (error) {
            console.error('Page initialization error:', error);
        }
    }

    // 🏠 Initialize Dashboard
    initializeDashboard() {
        console.log('🏠 Dashboard initialization');

        // Dashboard specific functionality
        window.createNewProduct = () => {
            this.notifications.show('🚀 Product creation coming soon!', 'info');
        };

        window.viewAllProducts = () => {
            this.notifications.show('📦 Product listing coming soon!', 'info');
        };
    }

    // 👤 Initialize Profile Page
    initializeProfile() {
        console.log('👤 Profile initialization');
    }

    // 🏠 Initialize Landing Page
    initializeLanding() {
        console.log('🏠 Landing page initialization');
    }

    // Additional Event Listeners
    attachDashboardListeners() {
        console.log('📊 Dashboard listeners attached');
    }

    attachProfileListeners() {
        console.log('👤 Profile listeners attached');
    }

    attachVerificationListeners() {
        console.log('✅ Verification listeners attached');
    }

    // ⏱️ Setup Session Timeout
    setupSessionTimeout() {
        try {
            if (this.sessionTimeoutId) {
                clearTimeout(this.sessionTimeoutId);
            }

            const timeoutDuration = CONFIG?.SESSION_TIMEOUT || 30 * 60 * 1000;

            this.sessionTimeoutId = setTimeout(() => {
                console.log('⏰ Session timeout reached');
                this.notifications.show('Your session has expired. Please sign in again.', 'warning');
                this.handleLogout();
            }, timeoutDuration);

            console.log(`⏱️ Session timeout set for ${timeoutDuration / 1000 / 60} minutes`);

        } catch (error) {
            console.error('Session timeout setup failed:', error);
        }
    }

    // 🎨 Apply Current Theme
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.theme || 'light');
    }

    // 📊 Generate Dashboard Stats
    generateDashboardStats() {
        return {
            products: Math.floor(Math.random() * 10) + 1,
            activeRentals: Math.floor(Math.random() * 5) + 1,
            earnings: '₹' + (Math.floor(Math.random() * 50000) + 5000).toLocaleString(),
            rating: (4.2 + Math.random() * 0.7).toFixed(1) + '⭐'
        };
    }

    // 🔐 Authentication Helper Methods
    isAuthenticated() {
        return !!(localStorage.getItem('authToken') || localStorage.getItem('user'));
    }

    getCurrentUser() {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    // API Integration Methods
    async loadProductsFromAPI() {
        try {
            const response = await fetch(`${this.apiEndpoints.products}/active`);
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    this.state.setState({ products: result.data });
                    return result.data;
                }
            }
        } catch (error) {
            console.error('Failed to load products from API:', error);
        }
        return null;
    }

    async loadPlatformStats() {
        try {
            const response = await fetch(`${this.apiEndpoints.products}/stats/platform`);
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    this.state.setState({ platformStats: result.data });
                    return result.data;
                }
            }
        } catch (error) {
            console.error('Failed to load platform stats:', error);
        }
        return null;
    }

    initializePremiumFeatures() {
        this.setupSessionTimeout();
    }

    // Loading screen methods
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

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    startPremiumLoadingExperience() {
        // Loading animation logic
        const steps = [
            { id: 'step-security', duration: 800 },
            { id: 'step-database', duration: 600 },
            { id: 'step-workspace', duration: 700 },
            { id: 'step-ui', duration: 400 }
        ];

        let currentStep = 0;
        const processStep = () => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                const stepEl = document.getElementById(step.id);
                if (stepEl) {
                    stepEl.classList.add('active');
                }
                if (currentStep > 0) {
                    const prevStep = document.getElementById(steps[currentStep - 1].id);
                    if (prevStep) {
                        prevStep.classList.remove('active');
                        prevStep.classList.add('completed');
                    }
                }
                currentStep++;
                setTimeout(processStep, step.duration);
            }
        };

        setTimeout(processStep, 500);
    }

    async simulateLoadingProgress() {
        return new Promise((resolve) => {
            const progressFill = document.getElementById('progress-fill');
            const progressValue = document.getElementById('progress-value');

            if (!progressFill) {
                setTimeout(resolve, 2000);
                return;
            }

            const steps = [
                { progress: 20, delay: 300 },
                { progress: 50, delay: 400 },
                { progress: 80, delay: 300 },
                { progress: 100, delay: 200 }
            ];

            let currentStep = 0;
            const updateProgress = () => {
                if (currentStep < steps.length) {
                    const step = steps[currentStep];
                    progressFill.style.width = step.progress + '%';
                    if (progressValue) progressValue.textContent = step.progress + '%';
                    currentStep++;
                    setTimeout(updateProgress, step.delay);
                } else {
                    setTimeout(resolve, 300);
                }
            };

            updateProgress();
        });
    }
}

// 🎨 Animation System
class AppAnimations {
    async exitAnimation(element, duration = 600) {
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px) scale(0.95)';
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    async enterAnimation(element, animationType = 'fadeIn', duration = 600) {
        element.style.opacity = '0';

        const animations = {
            fadeIn: () => element.style.transform = 'translateY(20px) scale(0.95)',
            slideInRight: () => element.style.transform = 'translateX(100px)',
            slideInLeft: () => element.style.transform = 'translateX(-100px)',
            slideInUp: () => element.style.transform = 'translateY(100px)',
            bounceIn: () => element.style.transform = 'scale(0.3)'
        };

        animations[animationType]?.();

        requestAnimationFrame(() => {
            element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0) scale(1)';
        });

        return new Promise(resolve => setTimeout(resolve, duration));
    }
}

// 📊 Analytics Management System
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
    }

    trackPageView(page) {
        this.trackEvent('page_view', { page, timestamp: Date.now() });
    }

    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data,
            timestamp: Date.now(),
            sessionId: this.getSessionId()
        };

        this.events.push(event);
        console.log('📊 Analytics event:', event);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }
}

// ✅ Initialize and export the application
const app = new OdooHackathonApp();
window.app = app;

export default app;
