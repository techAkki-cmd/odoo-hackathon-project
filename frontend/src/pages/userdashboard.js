import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, List, Grid, Heart, User, Menu, Car, Filter, ChevronLeft, ChevronRight, LogIn, X, MapPin, Calendar, Users, Fuel, Settings, Home, Smartphone, Wrench, Zap,} from "lucide-react";

const mockProducts = [
  {
    id: 1,
    name: "BMW X5 SUV",
    price: 4500,
    color: "Black",
    category: "Vehicle",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
    location: "Mumbai",
    seats: 5,
    fuel: "Petrol",
    year: 2023,
  },
  {
    id: 2,
    name: "Honda City",
    price: 2800,
    color: "Blue",
    category: "Vehicle",
    image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
    location: "Delhi",
    seats: 5,
    fuel: "Petrol",
    year: 2022,
  },
  {
    id: 3,
    name: "iPhone 15 Pro",
    price: 1200,
    color: "White",
    category: "Electronics",
    image: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg",
    location: "Bangalore",
    brand: "Apple",
    storage: "256GB",
    year: 2023,
  },
  {
    id: 4,
    name: "MacBook Pro",
    price: 2200,
    color: "Silver",
    category: "Electronics",
    image: "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg",
    location: "Chennai",
    brand: "Apple",
    storage: "512GB",
    year: 2022,
  },
  {
    id: 5,
    name: "Power Drill Set",
    price: 150,
    color: "Black",
    category: "Tools",
    image: "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
    location: "Pune",
    brand: "Bosch",
    type: "Cordless",
    year: 2024,
  },
  {
    id: 6,
    name: "2BHK Apartment",
    price: 25000,
    color: "White",
    category: "Property",
    image: "https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg",
    location: "Hyderabad",
    rooms: 2,
    area: "1200 sqft",
    year: 2023,
  },
  {
    id: 7,
    name: "Maruti Swift",
    price: 1500,
    color: "Red",
    category: "Vehicle",
    image: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg",
    location: "Mumbai",
    seats: 5,
    fuel: "Petrol",
    year: 2021,
  },
  {
    id: 8,
    name: "Samsung Galaxy",
    price: 800,
    color: "Blue",
    category: "Electronics",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
    location: "Delhi",
    brand: "Samsung",
    storage: "128GB",
    year: 2022,
  },
  {
    id: 9,
    name: "Luxury Villa",
    price: 95000,
    color: "Beige",
    category: "Property",
    image: "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
    location: "Bangalore",
    rooms: 4,
    area: "3000 sqft",
    year: 2024,
  },
  {
    id: 10,
    name: "Angle Grinder",
    price: 180,
    color: "Yellow",
    category: "Tools",
    image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
    location: "Chennai",
    brand: "DeWalt",
    type: "Electric",
    year: 2023,
  },
  {
    id: 11,
    name: "Tesla Model 3",
    price: 8500,
    color: "White",
    category: "Vehicle",
    image: "https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg",
    location: "Pune",
    seats: 5,
    fuel: "Electric",
    year: 2022,
  },
  {
    id: 12,
    name: "iPad Pro",
    price: 900,
    color: "Space Gray",
    category: "Electronics",
    image: "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg",
    location: "Hyderabad",
    brand: "Apple",
    storage: "256GB",
    year: 2021,
  },
  {
    id: 13,
    name: "Office Space",
    price: 45000,
    color: "Modern",
    category: "Property",
    image: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg",
    location: "Mumbai",
    rooms: "Open Plan",
    area: "2000 sqft",
    year: 2023,
  },
  {
    id: 14,
    name: "Circular Saw",
    price: 220,
    color: "Red",
    category: "Tools",
    image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg",
    location: "Delhi",
    brand: "Makita",
    type: "Cordless",
    year: 2022,
  },
  {
    id: 15,
    name: "Gaming Laptop",
    price: 1800,
    color: "Black",
    category: "Electronics",
    image: "https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg",
    location: "Bangalore",
    brand: "ASUS",
    storage: "1TB SSD",
    year: 2024,
  },
  {
    id: 16,
    name: "Penthouse",
    price: 150000,
    color: "Luxury",
    category: "Property",
    image: "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg",
    location: "Chennai",
    rooms: 5,
    area: "4500 sqft",
    year: 2024,
  },
  {
    id: 17,
    name: "Hyundai i20",
    price: 1600,
    color: "White",
    category: "Vehicle",
    image: "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg",
    location: "Pune",
    seats: 5,
    fuel: "Petrol",
    year: 2021,
  },
];

const categories = [
  { name: "All", icon: Grid },
  { name: "Vehicle", icon: Car },
  { name: "Electronics", icon: Smartphone },
  { name: "Tools", icon: Wrench },
  { name: "Property", icon: Home },
];

export default function UserDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [layout, setLayout] = useState("grid");
  const [sortOrder, setSortOrder] = useState("price-asc");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [likedProducts, setLikedProducts] = useState(new Set());

  const itemsPerPage = 8;

  const filteredProducts = useMemo(() => {
    return mockProducts
      .filter((p) => {
        const matchesCategory =
          selectedCategory === "All" || p.category === selectedCategory;
        const matchesPrice =
          p.price >= priceRange[0] && p.price <= priceRange[1];
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === "price-asc") return a.price - b.price;
        if (sortOrder === "price-desc") return b.price - a.price;
        if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
        if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
        return 0;
      });
  }, [selectedCategory, priceRange, searchTerm, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleLogin = (e) => {
    e.preventDefault();
    if (userEmail && userPassword) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setUserEmail("");
      setUserPassword("");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLike = (productId) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const getCategoryIcon = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.icon : Grid;
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        React.createElement(
          motion.button,
          {
            key: "prev",
            onClick: () => handlePageChange(currentPage - 1),
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            className:
              "mx-1 px-3 py-2 rounded-lg bg-white text-gray-600 border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 shadow-sm",
          },
          React.createElement(ChevronLeft, { size: 16 })
        )
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        React.createElement(
          motion.button,
          {
            key: i,
            onClick: () => handlePageChange(i),
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            className: `mx-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              i === currentPage
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-purple-50 hover:border-purple-200"
            }`,
          },
          i
        )
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        React.createElement(
          motion.button,
          {
            key: "next",
            onClick: () => handlePageChange(currentPage + 1),
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            className:
              "mx-1 px-3 py-2 rounded-lg bg-white text-gray-600 border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 shadow-sm",
          },
          React.createElement(ChevronRight, { size: 16 })
        )
      );
    }

    return pages;
  };

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, searchTerm, sortOrder]);

  return React.createElement(
    "div",
    {
      className:
        "min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100",
    },

    // Login Modal
    React.createElement(
      AnimatePresence,
      null,
      showLoginModal &&
        React.createElement(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className:
              "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",
            onClick: () => setShowLoginModal(false),
          },
          React.createElement(
            motion.div,
            {
              initial: { scale: 0.9, opacity: 0, rotateY: -15 },
              animate: { scale: 1, opacity: 1, rotateY: 0 },
              exit: { scale: 0.9, opacity: 0, rotateY: 15 },
              transition: { type: "spring", damping: 20, stiffness: 300 },
              className:
                "bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-purple-100",
              onClick: (e) => e.stopPropagation(),
            },
            React.createElement(
              "div",
              { className: "flex justify-between items-center mb-6" },
              React.createElement(
                "h2",
                {
                  className:
                    "text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent",
                },
                "Welcome Back"
              ),
              React.createElement(
                motion.button,
                {
                  onClick: () => setShowLoginModal(false),
                  whileHover: { scale: 1.1, rotate: 90 },
                  whileTap: { scale: 0.9 },
                  className:
                    "p-2 hover:bg-gray-100 rounded-full transition-colors",
                },
                React.createElement(X, { size: 20 })
              )
            ),
            React.createElement(
              "form",
              { onSubmit: handleLogin, className: "space-y-4" },
              React.createElement(
                "div",
                null,
                React.createElement(
                  "label",
                  { className: "block text-sm font-medium text-gray-700 mb-2" },
                  "Email Address"
                ),
                React.createElement("input", {
                  type: "email",
                  value: userEmail,
                  onChange: (e) => setUserEmail(e.target.value),
                  className:
                    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all",
                  placeholder: "you@example.com",
                  required: true,
                })
              ),
              React.createElement(
                "div",
                null,
                React.createElement(
                  "label",
                  { className: "block text-sm font-medium text-gray-700 mb-2" },
                  "Password"
                ),
                React.createElement("input", {
                  type: "password",
                  value: userPassword,
                  onChange: (e) => setUserPassword(e.target.value),
                  className:
                    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all",
                  placeholder: "Enter your password",
                  required: true,
                })
              ),
              React.createElement(
                motion.button,
                {
                  type: "submit",
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  className:
                    "w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg",
                },
                "Sign In"
              )
            )
          )
        )
    ),

    // Mobile Filters Modal
    React.createElement(
      AnimatePresence,
      null,
      showMobileFilters &&
        React.createElement(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className:
              "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4 md:hidden",
            onClick: () => setShowMobileFilters(false),
          },
          React.createElement(
            motion.div,
            {
              initial: { y: "100%" },
              animate: { y: 0 },
              exit: { y: "100%" },
              transition: { type: "spring", damping: 25, stiffness: 300 },
              className:
                "bg-white rounded-t-2xl p-6 w-full max-w-md shadow-2xl",
              onClick: (e) => e.stopPropagation(),
            },
            React.createElement(
              "div",
              { className: "flex justify-between items-center mb-6" },
              React.createElement(
                "h2",
                { className: "text-xl font-bold text-gray-800" },
                "Filters"
              ),
              React.createElement(
                motion.button,
                {
                  onClick: () => setShowMobileFilters(false),
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  className:
                    "p-2 hover:bg-gray-100 rounded-full transition-colors",
                },
                React.createElement(X, { size: 20 })
              )
            ),
            React.createElement(
              "div",
              { className: "space-y-6" },
              React.createElement(
                "div",
                null,
                React.createElement(
                  "h3",
                  { className: "text-sm font-semibold text-gray-700 mb-3" },
                  "Price Range"
                ),
                React.createElement("input", {
                  type: "range",
                  min: 0,
                  max: 200000,
                  step: 1000,
                  value: priceRange[1],
                  onChange: (e) => setPriceRange([0, Number(e.target.value)]),
                  className: "w-full accent-purple-600",
                }),
                React.createElement(
                  "div",
                  {
                    className:
                      "flex justify-between text-sm text-gray-600 mt-2",
                  },
                  React.createElement("span", null, "₹0"),
                  React.createElement(
                    "span",
                    { className: "font-medium" },
                    `₹${priceRange[1].toLocaleString()}`
                  )
                )
              )
            )
          )
        )
    ),

    // Header Navigation
    React.createElement(
      "nav",
      {
        className:
          "sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-purple-100 shadow-sm",
      },
      React.createElement(
        "div",
        {
          className:
            "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16",
        },
        // Left: Logo and Navigation
        React.createElement(
          "div",
          { className: "flex items-center gap-6" },
          React.createElement(
            "div",
            { className: "flex items-center gap-2" },
            React.createElement(
              motion.div,
              {
                className:
                  "w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center",
                whileHover: { rotate: 180, scale: 1.1 },
                transition: { duration: 0.3 },
              },
              React.createElement(Zap, { size: 24, className: "text-white" })
            ),
            React.createElement(
              "span",
              {
                className:
                  "text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent",
              },
              "RentHub"
            )
          ),
          // Desktop Navigation
          React.createElement(
            "div",
            { className: "hidden md:flex items-center gap-4" },
            ["Home", "Rental Shop", "Wishlist"].map((item) =>
              React.createElement(
                motion.button,
                {
                  key: item,
                  whileHover: { scale: 1.05, y: -2 },
                  whileTap: { scale: 0.95 },
                  className:
                    "px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors rounded-lg hover:bg-purple-50",
                },
                item
              )
            )
          )
        ),
        // Right: User Actions
        React.createElement(
          "div",
          { className: "flex items-center gap-3" },
          // Cart Icon
          React.createElement(
            motion.button,
            {
              whileHover: { scale: 1.1, rotate: 5 },
              whileTap: { scale: 0.9 },
              className:
                "p-2 hover:bg-purple-50 rounded-lg transition-colors relative",
            },
            React.createElement(ShoppingCart, {
              size: 20,
              className: "text-gray-700",
            }),
            React.createElement(
              "span",
              {
                className:
                  "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center",
              },
              "3"
            )
          ),
          // Profile Section
          isLoggedIn
            ? React.createElement(
                "div",
                { className: "flex items-center gap-2" },
                React.createElement(
                  motion.div,
                  {
                    className:
                      "w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center",
                    whileHover: { scale: 1.1 },
                  },
                  React.createElement(User, {
                    size: 16,
                    className: "text-white",
                  })
                ),
                React.createElement(
                  "span",
                  { className: "hidden sm:inline font-medium text-gray-700" },
                  "adam"
                ),
                React.createElement(
                  motion.button,
                  {
                    onClick: handleLogout,
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    className:
                      "ml-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                  },
                  "Logout"
                )
              )
            : React.createElement(
                motion.button,
                {
                  onClick: () => setShowLoginModal(true),
                  whileHover: { scale: 1.05, y: -2 },
                  whileTap: { scale: 0.95 },
                  className:
                    "flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg",
                },
                React.createElement(LogIn, { size: 16 }),
                "Login"
              ),
          React.createElement(
            motion.button,
            {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              className:
                "hidden md:inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors",
            },
            "Contact us"
          ),
          // Mobile menu toggle
          React.createElement(
            motion.button,
            {
              className:
                "md:hidden p-2 hover:bg-purple-50 rounded-lg transition-colors",
              onClick: () => setMobileMenuOpen(!mobileMenuOpen),
              whileHover: { scale: 1.1 },
              whileTap: { scale: 0.9 },
            },
            React.createElement(Menu, { size: 20 })
          )
        )
      )
    ),

    // Mobile Menu
    React.createElement(
      AnimatePresence,
      null,
      mobileMenuOpen &&
        React.createElement(
          motion.div,
          {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            className:
              "md:hidden bg-white/90 backdrop-blur-xl border-b border-purple-100 shadow-lg",
          },
          React.createElement(
            "div",
            { className: "px-4 py-3 space-y-2" },
            ["Home", "Rental Shop", "Wishlist", "Contact us"].map((item) =>
              React.createElement(
                motion.button,
                {
                  key: item,
                  whileHover: { x: 5 },
                  className:
                    "block w-full text-left px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors",
                },
                item
              )
            )
          )
        )
    ),

    // Category Navigation
    React.createElement(
      "div",
      { className: "bg-white/80 backdrop-blur-xl border-b border-purple-100" },
      React.createElement(
        "div",
        { className: "max-w-7xl mx-auto px-4 py-3" },
        React.createElement(
          "div",
          { className: "flex gap-2 overflow-x-auto scrollbar-hide" },
          categories.map((cat) =>
            React.createElement(
              motion.button,
              {
                key: cat.name,
                onClick: () => setSelectedCategory(cat.name),
                whileHover: { scale: 1.05, y: -2 },
                whileTap: { scale: 0.95 },
                className: `flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-purple-50 border border-purple-100"
                }`,
              },
              React.createElement(cat.icon, { size: 16 }),
              cat.name
            )
          )
        )
      )
    ),

    // Main Content
    React.createElement(
      "div",
      { className: "max-w-7xl mx-auto px-4 py-6" },
      React.createElement(
        "div",
        { className: "grid grid-cols-1 lg:grid-cols-4 gap-6" },
        // Filters Sidebar (Desktop)
        React.createElement(
          "aside",
          { className: "lg:col-span-1 hidden lg:block" },
          React.createElement(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              className:
                "bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 shadow-sm sticky top-24",
            },
            React.createElement(
              "div",
              { className: "flex items-center gap-2 mb-6" },
              React.createElement(Filter, {
                size: 20,
                className: "text-purple-600",
              }),
              React.createElement(
                "h2",
                { className: "text-lg font-bold text-gray-800" },
                "Product attributes"
              )
            ),
            // Price Range
            React.createElement(
              "div",
              null,
              React.createElement(
                "h3",
                { className: "text-sm font-semibold text-gray-700 mb-3" },
                "Price range"
              ),
              React.createElement("input", {
                type: "range",
                min: 0,
                max: 200000,
                step: 1000,
                value: priceRange[1],
                onChange: (e) => setPriceRange([0, Number(e.target.value)]),
                className: "w-full accent-purple-600",
              }),
              React.createElement(
                "div",
                {
                  className: "flex justify-between text-sm text-gray-600 mt-2",
                },
                React.createElement("span", null, "₹0"),
                React.createElement(
                  "span",
                  { className: "font-medium" },
                  `₹${priceRange[1].toLocaleString()}`
                )
              )
            )
          )
        ),
        // Products Grid
        React.createElement(
          "main",
          { className: "lg:col-span-3" },
          // Results Header
          React.createElement(
            "div",
            {
              className:
                "flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 bg-white/80 backdrop-blur-xl rounded-lg p-4 border border-purple-100",
            },
            React.createElement(
              "div",
              { className: "flex items-center gap-4" },
              React.createElement(
                "select",
                {
                  className:
                    "px-3 py-2 border border-purple-200 rounded-lg text-sm font-medium bg-white/80 backdrop-blur-xl",
                },
                React.createElement("option", null, "Price List")
              ),
              React.createElement(
                "div",
                {
                  className:
                    "flex items-center border border-purple-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-xl flex-1 max-w-md",
                },
                React.createElement(Search, {
                  size: 16,
                  className: "text-gray-400 mr-2",
                }),
                React.createElement("input", {
                  type: "text",
                  placeholder: "Search...",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  className: "outline-none flex-1 text-sm bg-transparent",
                }),
                React.createElement(
                  motion.button,
                  {
                    onClick: () => setShowMobileFilters(true),
                    whileHover: { scale: 1.1 },
                    whileTap: { scale: 0.9 },
                    className:
                      "md:hidden p-1 hover:bg-purple-50 rounded transition-colors",
                  },
                  React.createElement(Filter, {
                    size: 16,
                    className: "text-purple-600",
                  })
                )
              ),
              React.createElement(
                "select",
                {
                  value: sortOrder,
                  onChange: (e) => setSortOrder(e.target.value),
                  className:
                    "px-3 py-2 border border-purple-200 rounded-lg text-sm font-medium bg-white/80 backdrop-blur-xl",
                },
                React.createElement(
                  "option",
                  { value: "price-asc" },
                  "Sort by"
                ),
                React.createElement(
                  "option",
                  { value: "price-asc" },
                  "Price: Low to High"
                ),
                React.createElement(
                  "option",
                  { value: "price-desc" },
                  "Price: High to Low"
                )
              )
            ),
            React.createElement(
              "div",
              { className: "flex items-center gap-2" },
              React.createElement(
                motion.button,
                {
                  onClick: () => setLayout("grid"),
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  className: `p-2 rounded-lg transition-all ${
                    layout === "grid"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-purple-50"
                  }`,
                },
                React.createElement(Grid, { size: 18 })
              ),
              React.createElement(
                motion.button,
                {
                  onClick: () => setLayout("list"),
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  className: `p-2 rounded-lg transition-all ${
                    layout === "list"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-purple-50"
                  }`,
                },
                React.createElement(List, { size: 18 })
              )
            )
          ),
          // Products
          currentProducts.length > 0
            ? React.createElement(
                "div",
                {
                  className:
                    layout === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      : "space-y-4",
                },
                currentProducts.map((product, index) => {
                  const IconComponent = getCategoryIcon(product.category);
                  const isLiked = likedProducts.has(product.id);

                  return React.createElement(
                    motion.div,
                    {
                      key: product.id,
                      initial: { opacity: 0, y: 20, scale: 0.9 },
                      animate: { opacity: 1, y: 0, scale: 1 },
                      transition: {
                        delay: index * 0.1,
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                      },
                      whileHover: { y: -5, scale: 1.02 },
                      className: `group bg-white/80 backdrop-blur-xl rounded-xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 ${
                        layout === "list" ? "flex flex-row" : "flex flex-col"
                      }`,
                    },
                    // Image
                    React.createElement(
                      "div",
                      {
                        className:
                          layout === "list"
                            ? "w-24 h-20 flex-shrink-0 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center"
                            : "w-full h-24 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative",
                      },
                      React.createElement(
                        motion.div,
                        {
                          whileHover: { scale: 1.1, rotate: 5 },
                          transition: {
                            type: "spring",
                            damping: 15,
                            stiffness: 300,
                          },
                        },
                        React.createElement(IconComponent, {
                          size: layout === "list" ? 20 : 28,
                          className: "text-purple-600",
                        })
                      ),
                      layout === "grid" &&
                        React.createElement(
                          motion.button,
                          {
                            onClick: () => toggleLike(product.id),
                            whileHover: { scale: 1.2 },
                            whileTap: { scale: 0.8 },
                            className:
                              "absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm",
                          },
                          React.createElement(Heart, {
                            size: 14,
                            className: `transition-colors ${
                              isLiked
                                ? "text-red-500 fill-red-500"
                                : "text-gray-400"
                            } `,
                          })
                        )
                    ),
                    // Content
                    React.createElement(
                      "div",
                      {
                        className:
                          layout === "list"
                            ? "flex-1 p-3 flex justify-between items-center"
                            : "p-3 flex-1",
                      },
                      React.createElement(
                        "div",
                        { className: layout === "list" ? "flex-1" : "" },
                        React.createElement(
                          "h3",
                          {
                            className:
                              "text-sm font-semibold text-gray-800 mb-1 line-clamp-1",
                          },
                          product.name
                        ),
                        React.createElement(
                          "p",
                          {
                            className:
                              "text-xs text-purple-600 font-medium mb-2",
                          },
                          `₹${product.price.toLocaleString()}`
                        ),
                        layout === "grid" &&
                          React.createElement(
                            "div",
                            { className: "flex items-center justify-between" },
                            React.createElement(
                              motion.button,
                              {
                                whileHover: { scale: 1.05 },
                                whileTap: { scale: 0.95 },
                                className:
                                  "bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm hover:shadow-md transition-all",
                              },
                              "Add to Cart",
                              React.createElement(ShoppingCart, { size: 10 })
                            ),
                            React.createElement(
                              motion.button,
                              {
                                onClick: () => toggleLike(product.id),
                                whileHover: { scale: 1.2 },
                                whileTap: { scale: 0.8 },
                                className:
                                  "p-1 border border-purple-200 rounded hover:bg-purple-50 transition-colors",
                              },
                              React.createElement(Heart, {
                                size: 12,
                                className: ` transition-colors ${
                                  isLiked
                                    ? "text-red-500 fill-red-500"
                                    : "text-gray-600"
                                } `,
                              })
                            )
                          )
                      ),
                      layout === "list" &&
                        React.createElement(
                          "div",
                          { className: "flex items-center gap-2" },
                          React.createElement(
                            motion.button,
                            {
                              whileHover: { scale: 1.05 },
                              whileTap: { scale: 0.95 },
                              className:
                                "bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1",
                            },
                            "Add to Cart",
                            React.createElement(ShoppingCart, { size: 10 })
                          ),
                          React.createElement(
                            motion.button,
                            {
                              onClick: () => toggleLike(product.id),
                              whileHover: { scale: 1.2 },
                              whileTap: { scale: 0.8 },
                              className:
                                "p-1 border border-purple-200 rounded hover:bg-purple-50 transition-colors",
                            },
                            React.createElement(Heart, {
                              size: 12,
                              className: `transition-colors ${
                                isLiked
                                  ? "text-red-500 fill-red-500"
                                  : "text-gray-600"
                              } `,
                            })
                          )
                        )
                    )
                  );
                })
              )
            : React.createElement(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 },
                  className: "text-center py-12",
                },
                React.createElement(
                  motion.div,
                  {
                    animate: { rotate: [0, 10, -10, 0] },
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    },
                  },
                  React.createElement(Search, {
                    size: 48,
                    className: "text-gray-400 mx-auto mb-4",
                  })
                ),
                React.createElement(
                  "h3",
                  { className: "text-xl font-semibold text-gray-800 mb-2" },
                  "No products found"
                ),
                React.createElement(
                  "p",
                  { className: "text-gray-600" },
                  "Try adjusting your filters to see more results."
                )
              ),
          // Pagination
          totalPages > 1 &&
            React.createElement(
              "div",
              { className: "flex justify-center items-center mt-8 gap-2" },
              renderPagination()
            ),
          // Results info
          React.createElement(
            "div",
            { className: "text-center mt-4 text-sm text-gray-600" },
            `Showing ${startIndex + 1}-${Math.min(
              endIndex,
              filteredProducts.length
            )} of ${filteredProducts.length} results`
          )
        )
      )
    ),

    // Mobile Bottom Navigation
    React.createElement(
      "nav",
      {
        className:
          "fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-purple-100 md:hidden shadow-lg",
      },
      React.createElement(
        "div",
        { className: "flex justify-around items-center py-2" },
        [
          { label: "Home", icon: Home },
          { label: "Search", icon: Search },
          { label: "Wishlist", icon: Heart },
          { label: "Cart", icon: ShoppingCart },
          { label: "Profile", icon: User },
        ].map((item) =>
          React.createElement(
            motion.button,
            {
              key: item.label,
              whileHover: { scale: 1.1, y: -2 },
              whileTap: { scale: 0.9 },
              className:
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors",
            },
            React.createElement(item.icon, {
              size: 18,
              className: "text-gray-600",
            }),
            React.createElement(
              "span",
              { className: "text-xs text-gray-600" },
              item.label
            )
          )
        )
      )
    )
  );
}
export function attachUserDashboardListeners() {
  const exploreBtn = document.getElementById("explore-btn");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      alert("Explore button clicked!");
      // Add more logic here as needed
    });
  }
}
