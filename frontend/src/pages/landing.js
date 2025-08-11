// src/pages/landing.js - Modern Landing Page with Backend Integration
import { utils, icons, createFloatingElements } from '../utils/common.js';

// 🎯 Hardcoded Product Data (Replace with API calls later)
const mockProducts = [
    {
        id: 1,
        name: "BMW X5 SUV",
        pricePerDay: 4500,
        color: "Black",
        category: "VEHICLE",
        location: "Mumbai",
        seats: 5,
        fuel: "Petrol",
        year: 2023,
        isActive: true,
        isAvailable: true
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        pricePerDay: 1200,
        color: "White",
        category: "ELECTRONICS",
        location: "Delhi",
        brand: "Apple",
        storage: "256GB",
        year: 2023,
        isActive: true,
        isAvailable: true
    },
    {
        id: 3,
        name: "MacBook Pro",
        pricePerDay: 2200,
        color: "Silver",
        category: "ELECTRONICS",
        location: "Bangalore",
        brand: "Apple",
        storage: "512GB",
        year: 2022,
        isActive: true,
        isAvailable: true
    },
    {
        id: 4,
        name: "Power Drill Set",
        pricePerDay: 150,
        color: "Black",
        category: "TOOLS",
        location: "Chennai",
        brand: "Bosch",
        type: "Cordless",
        year: 2024,
        isActive: true,
        isAvailable: true
    },
    {
        id: 5,
        name: "2BHK Apartment",
        pricePerDay: 2500,
        color: "White",
        category: "PROPERTY",
        location: "Pune",
        rooms: 2,
        area: "1200 sqft",
        year: 2023,
        isActive: true,
        isAvailable: true
    },
    {
        id: 6,
        name: "Tesla Model 3",
        pricePerDay: 8500,
        color: "White",
        category: "VEHICLE",
        location: "Hyderabad",
        seats: 5,
        fuel: "Electric",
        year: 2022,
        isActive: true,
        isAvailable: true
    }
];

// 🎨 Categories with icons
const categories = [
    { name: 'All', icon: '🏠', description: 'All Products' },
    { name: 'VEHICLE', icon: '🚗', description: 'Cars & Bikes' },
    { name: 'ELECTRONICS', icon: '📱', description: 'Gadgets & Tech' },
    { name: 'TOOLS', icon: '🔧', description: 'Tools & Equipment' },
    { name: 'PROPERTY', icon: '🏢', description: 'Homes & Offices' }
];

// 🏠 Main Landing Page Renderer
export function renderLandingPage() {
    return `
        <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
            <!-- Navigation Header -->
            <nav class="bg-white/90 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-50 shadow-sm">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <!-- Logo -->
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <div>
                                <h1 class="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">RentHub</h1>
                                <p class="text-xs text-gray-500">Rental Platform</p>
                            </div>
                        </div>

                        <!-- Navigation Links -->
                        <div class="hidden md:flex items-center space-x-6">
                            <button class="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">Home</button>
                            <button class="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">Products</button>
                            <button class="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">About</button>
                            <button class="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200">Contact</button>
                        </div>

                        <!-- Auth Buttons -->
                        <div class="flex items-center space-x-3">
                            <button
                                onclick="app.navigate('login')"
                                class="hidden sm:inline-flex items-center px-4 py-2 border border-purple-300 rounded-lg text-purple-700 bg-white hover:bg-purple-50 transition-all duration-200 font-medium">
                                Sign In
                            </button>
                            <button
                                onclick="app.navigate('signup')"
                                class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Hero Section -->
            <section class="relative py-20 overflow-hidden">
                ${createFloatingElements()}

                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div class="text-center">
                        <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
                            Rent Anything,<br>
                            <span class="text-gray-800">Anytime</span>
                        </h1>
                        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            From vehicles to electronics, tools to properties. Discover thousands of products available for rent from verified owners across India.
                        </p>

                        <!-- Search Bar -->
                        <div class="max-w-2xl mx-auto mb-12">
                            <div class="relative">
                                <input
                                    type="text"
                                    id="hero-search"
                                    placeholder="Search for cars, phones, tools, apartments..."
                                    class="w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg bg-white/80 backdrop-blur-sm">
                                <button class="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium">
                                    Search
                                </button>
                            </div>
                        </div>

                        <!-- Quick Stats -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            <div class="text-center">
                                <div class="text-3xl font-bold text-purple-600 mb-2">1000+</div>
                                <div class="text-gray-600">Products</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-blue-600 mb-2">50+</div>
                                <div class="text-gray-600">Cities</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-indigo-600 mb-2">500+</div>
                                <div class="text-gray-600">Verified Owners</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-pink-600 mb-2">4.8★</div>
                                <div class="text-gray-600">User Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Categories Section -->
            <section class="py-16 bg-white/50 backdrop-blur-sm">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-12">
                        <h2 class="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
                        <p class="text-xl text-gray-600">Find exactly what you need from our diverse rental categories</p>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
                        ${categories.map(category => `
                            <button
                                onclick="filterByCategory('${category.name}')"
                                class="category-card group p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2">
                                <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">${category.icon}</div>
                                <h3 class="font-semibold text-gray-900 mb-2">${category.description}</h3>
                                <p class="text-sm text-gray-500">Explore ${category.name === 'All' ? 'all items' : category.description.toLowerCase()}</p>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- Featured Products Section -->
            <section class="py-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-12">
                        <h2 class="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
                        <p class="text-xl text-gray-600">Popular items that our customers love</p>
                    </div>

                    <!-- Search and Filter Controls -->
                    <div class="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="relative">
                                <input
                                    type="text"
                                    id="product-search"
                                    placeholder="Search products..."
                                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>

                            <select id="category-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                ${categories.map(cat => `<option value="${cat.name}">${cat.description}</option>`).join('')}
                            </select>
                        </div>

                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-gray-600">Sort by:</span>
                            <select id="sort-filter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name">Name</option>
                                <option value="newest">Newest First</option>
                            </select>
                        </div>
                    </div>

                    <!-- Products Grid -->
                    <div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        ${renderProductsGrid(mockProducts.slice(0, 6))}
                    </div>

                    <!-- View All Button -->
                    <div class="text-center">
                        <button
                            onclick="showAllProducts()"
                            class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg">
                            View All Products
                            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            <!-- How It Works Section -->
            <section class="py-16 bg-gradient-to-r from-purple-50 to-blue-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-12">
                        <h2 class="text-4xl font-bold text-gray-900 mb-4">How RentHub Works</h2>
                        <p class="text-xl text-gray-600">Simple steps to start renting</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="text-center group">
                            <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <span class="text-2xl font-bold text-white">1</span>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">Browse & Search</h3>
                            <p class="text-gray-600">Find the perfect item from thousands of products across multiple categories</p>
                        </div>

                        <div class="text-center group">
                            <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <span class="text-2xl font-bold text-white">2</span>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">Book & Pay</h3>
                            <p class="text-gray-600">Select your rental period and make secure payments through our platform</p>
                        </div>

                        <div class="text-center group">
                            <div class="w-20 h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <span class="text-2xl font-bold text-white">3</span>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">Enjoy & Return</h3>
                            <p class="text-gray-600">Use the item for your rental period and return it in the same condition</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
                <div class="absolute inset-0 bg-black/10"></div>
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Renting?</h2>
                    <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who trust RentHub for their rental needs</p>

                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onclick="app.navigate('signup')"
                            class="px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Join as Customer
                        </button>
                        <button
                            onclick="app.navigate('signup')"
                            class="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200 font-bold text-lg">
                            Become an Owner
                        </button>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer class="bg-gray-900 text-white py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 class="text-xl font-bold mb-4">RentHub</h3>
                            <p class="text-gray-400 mb-4">Your trusted rental platform for everything you need, anytime you need it.</p>
                            <div class="flex space-x-4">
                                <button class="text-gray-400 hover:text-white transition-colors">📧</button>
                                <button class="text-gray-400 hover:text-white transition-colors">📱</button>
                                <button class="text-gray-400 hover:text-white transition-colors">🌐</button>
                            </div>
                        </div>

                        <div>
                            <h4 class="font-semibold mb-4">Categories</h4>
                            <ul class="space-y-2 text-gray-400">
                                <li><button class="hover:text-white transition-colors">Vehicles</button></li>
                                <li><button class="hover:text-white transition-colors">Electronics</button></li>
                                <li><button class="hover:text-white transition-colors">Tools</button></li>
                                <li><button class="hover:text-white transition-colors">Properties</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 class="font-semibold mb-4">Support</h4>
                            <ul class="space-y-2 text-gray-400">
                                <li><button class="hover:text-white transition-colors">Help Center</button></li>
                                <li><button class="hover:text-white transition-colors">Contact Us</button></li>
                                <li><button class="hover:text-white transition-colors">Safety</button></li>
                                <li><button class="hover:text-white transition-colors">Terms</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 class="font-semibold mb-4">Company</h4>
                            <ul class="space-y-2 text-gray-400">
                                <li><button class="hover:text-white transition-colors">About Us</button></li>
                                <li><button class="hover:text-white transition-colors">Careers</button></li>
                                <li><button class="hover:text-white transition-colors">Press</button></li>
                                <li><button class="hover:text-white transition-colors">Blog</button></li>
                            </ul>
                        </div>
                    </div>

                    <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 RentHub. All rights reserved. Built for Odoo Hackathon.</p>
                    </div>
                </div>
            </footer>
        </div>
    `;
}

// 🎯 Product Grid Renderer
function renderProductsGrid(products) {
    return products.map(product => `
        <div class="product-card group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
            <!-- Product Image Placeholder -->
            <div class="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative overflow-hidden">
                <div class="text-4xl">${getCategoryIcon(product.category)}</div>
                <div class="absolute top-4 right-4">
                    <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">Available</span>
                </div>
            </div>

            <!-- Product Info -->
            <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <h3 class="font-semibold text-gray-900 text-lg mb-1 group-hover:text-purple-600 transition-colors">${product.name}</h3>
                        <p class="text-sm text-gray-500 flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            ${product.location}
                        </p>
                    </div>
                    <button class="text-gray-400 hover:text-red-500 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>

                <!-- Product Details -->
                <div class="space-y-2 mb-4">
                    ${product.category === 'VEHICLE' ? `
                        <p class="text-sm text-gray-600">🚗 ${product.seats} Seats • ${product.fuel} • ${product.year}</p>
                    ` : ''}
                    ${product.category === 'ELECTRONICS' ? `
                        <p class="text-sm text-gray-600">📱 ${product.brand} • ${product.storage} • ${product.year}</p>
                    ` : ''}
                    ${product.category === 'PROPERTY' ? `
                        <p class="text-sm text-gray-600">🏠 ${product.rooms} Rooms • ${product.area}</p>
                    ` : ''}
                    ${product.category === 'TOOLS' ? `
                        <p class="text-sm text-gray-600">🔧 ${product.brand} • ${product.type}</p>
                    ` : ''}
                </div>

                <!-- Price and Action -->
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-2xl font-bold text-purple-600">₹${product.pricePerDay.toLocaleString()}</span>
                        <span class="text-sm text-gray-500">/day</span>
                    </div>
                    <button
                        onclick="showProductDetails(${product.id})"
                        class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                        Rent Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 🎯 Category Icon Helper
function getCategoryIcon(category) {
    const icons = {
        'VEHICLE': '🚗',
        'ELECTRONICS': '📱',
        'TOOLS': '🔧',
        'PROPERTY': '🏠'
    };
    return icons[category] || '📦';
}

// 🎯 Landing Page Event Listeners
export function attachLandingListeners() {
    console.log('🏠 Attaching landing page listeners');

    // Initialize product filtering and search
    initializeProductFiltering();

    // Initialize search functionality
    initializeSearch();

    // Initialize authentication check
    checkAuthenticationStatus();

    // Initialize landing-specific global functions
    setupLandingGlobals();

    console.log('✅ Landing page listeners attached successfully');
}

// 🔍 Initialize Product Filtering
function initializeProductFiltering() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const productSearch = document.getElementById('product-search');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            filterAndSortProducts();
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', () => {
            filterAndSortProducts();
        });
    }

    if (productSearch) {
        let searchTimeout;
        productSearch.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterAndSortProducts();
            }, 300);
        });
    }
}

// 🔍 Filter and Sort Products
function filterAndSortProducts() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const productSearch = document.getElementById('product-search');
    const productsGrid = document.getElementById('products-grid');

    if (!productsGrid) return;

    let filteredProducts = [...mockProducts];

    // Apply category filter
    if (categoryFilter && categoryFilter.value !== 'All') {
        filteredProducts = filteredProducts.filter(product =>
            product.category === categoryFilter.value
        );
    }

    // Apply search filter
    if (productSearch && productSearch.value.trim()) {
        const searchTerm = productSearch.value.trim().toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.location.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    // Apply sorting
    if (sortFilter) {
        switch (sortFilter.value) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.pricePerDay - b.pricePerDay);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.pricePerDay - a.pricePerDay);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                filteredProducts.sort((a, b) => b.year - a.year);
                break;
        }
    }

    // Update the grid
    productsGrid.innerHTML = renderProductsGrid(filteredProducts);
}

// 🔍 Initialize Search
function initializeSearch() {
    const heroSearch = document.getElementById('hero-search');

    if (heroSearch) {
        heroSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performHeroSearch();
            }
        });
    }
}

// 🔍 Perform Hero Search
function performHeroSearch() {
    const heroSearch = document.getElementById('hero-search');
    const productSearch = document.getElementById('product-search');

    if (heroSearch && productSearch) {
        productSearch.value = heroSearch.value;
        // Scroll to products section
        document.getElementById('products-grid')?.scrollIntoView({
            behavior: 'smooth'
        });
        // Apply search
        filterAndSortProducts();
    }
}

// 🔐 Check Authentication Status
function checkAuthenticationStatus() {
    // This will be called when the landing page loads
    // Can be used to update UI based on auth status
    if (window.app && window.app.isAuthenticated()) {
        console.log('User is authenticated');
        // Could show different UI for logged in users
    }
}

// 🌐 Setup Landing Page Global Functions
function setupLandingGlobals() {
    // Category filtering
    window.filterByCategory = (categoryName) => {
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = categoryName;
            filterAndSortProducts();

            // Scroll to products section
            document.getElementById('products-grid')?.scrollIntoView({
                behavior: 'smooth'
            });
        }
    };

    // Show all products
    window.showAllProducts = () => {
        // Reset all filters
        const categoryFilter = document.getElementById('category-filter');
        const productSearch = document.getElementById('product-search');
        const sortFilter = document.getElementById('sort-filter');

        if (categoryFilter) categoryFilter.value = 'All';
        if (productSearch) productSearch.value = '';
        if (sortFilter) sortFilter.value = 'price-asc';

        filterAndSortProducts();

        // Scroll to products
        document.getElementById('products-grid')?.scrollIntoView({
            behavior: 'smooth'
        });
    };

    // Show product details
    window.showProductDetails = (productId) => {
        const product = mockProducts.find(p => p.id === productId);
        if (product) {
            // For now, show an alert. Later this could open a modal or navigate to product page
            alert(`Product: ${product.name}\nPrice: ₹${product.pricePerDay}/day\nLocation: ${product.location}\n\nClick OK to sign up and start renting!`);

            // Encourage signup
            if (window.app && !window.app.isAuthenticated()) {
                window.app.navigate('signup');
            }
        }
    };

    console.log('✅ Landing page global functions setup complete');
}

// 🎯 Export for use in other modules
export { mockProducts, categories };
