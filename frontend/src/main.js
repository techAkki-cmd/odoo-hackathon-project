// src/main.js - Application Entry Point
// 🏆 Hackathon-Ready Modular Architecture

import { OdooHackathonApp } from './app.js';
import './style.css';

// 🚀 Initialize the Application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Odoo Hackathon Platform...');

    try {
        // Create and start the app
        const app = new OdooHackathonApp();

        // Make app globally available for onclick handlers
        window.app = app;

        console.log('✅ Application initialized successfully');

    } catch (error) {
        console.error('❌ Failed to initialize application:', error);

        // Fallback error display
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-red-50">
                    <div class="text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
                        <div class="text-red-500 text-6xl mb-4">⚠️</div>
                        <h1 class="text-2xl font-bold text-red-600 mb-2">Application Error</h1>
                        <p class="text-gray-600 mb-4">Failed to initialize the hackathon platform.</p>
                        <button
                            onclick="window.location.reload()"
                            class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
                            Reload Page
                        </button>
                    </div>
                </div>
            `;
        }
    }
});

// Enhanced CSS for premium effects (from your original code)
const premiumStyles = `
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
`;

// Inject premium styles
const styleElement = document.createElement('style');
styleElement.textContent = premiumStyles;
document.head.appendChild(styleElement);

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

export default OdooHackathonApp;
