import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ShoppingCart,
  Search,
  Package,
  BarChart3,
  Settings,
  User,
  ChevronDown,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Zap
} from "lucide-react";

// Navigation tabs data with icons
const navigationTabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'rental', label: 'Rental', icon: ShoppingCart },
  { id: 'order', label: 'Order', icon: Package },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'reporting', label: 'Reporting', icon: FileText },
  { id: 'setting', label: 'Setting', icon: Settings }
];

// Mock dashboard stats and data
const dashboardStats = {
  quotations: { value: 10, change: 12.5, trend: 'up' },
  rentals: { value: 26, change: 8.3, trend: 'up' },
  revenue: { value: 10599, change: -2.1, trend: 'down' }
};

const topProductCategories = [
  { category: "Rental - Service", ordered: 25, revenue: 2940 },
  { category: "Electronics", ordered: 18, revenue: 2200 },
  { category: "Tools", ordered: 15, revenue: 1800 },
  { category: "Vehicles", ordered: 12, revenue: 3200 },
  { category: "Property", ordered: 8, revenue: 1500 }
];

const topProducts = [
  { product: "Wheelchairs", ordered: 10, revenue: 3032 },
  { product: "Tables", ordered: 5, revenue: 1008 },
  { product: "Chairs", ordered: 4, revenue: 3008 },
  { product: "BMW X5", ordered: 8, revenue: 2500 },
  { product: "MacBook Pro", ordered: 6, revenue: 1800 }
];

const topCustomers = [
  { customer: "Customer1", ordered: 10, revenue: 3032 },
  { customer: "Customer2", ordered: 5, revenue: 1008 },
  { customer: "Customer3", ordered: 4, revenue: 3008 },
  { customer: "Customer4", ordered: 7, revenue: 2200 },
  { customer: "Customer5", ordered: 3, revenue: 900 }
];

const periodOptions = [
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'last30days', label: 'Last 30 days' },
  { value: 'last90days', label: 'Last 90 days' },
  { value: 'lastyear', label: 'Last year' },
  { value: 'custom', label: 'Custom range' }
];

// Reusable StatCard component with React.createElement
function StatCard({ title, value, change, trend, icon: Icon, delay = 0 }) {
  return React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { delay, type: "spring", damping: 20, stiffness: 300 },
      whileHover: { y: -5, scale: 1.02 },
      className: "bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300"
    },
    React.createElement(
      "div",
      { className: "flex items-center justify-between mb-4" },
      React.createElement(
        "div",
        { className: "flex items-center gap-3" },
        React.createElement(
          motion.div,
          {
            whileHover: { scale: 1.1, rotate: 5 },
            className: "w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center"
          },
          React.createElement(Icon, { size: 24, className: "text-white" })
        ),
        React.createElement(
          "div",
          null,
          React.createElement("p", { className: "text-sm text-gray-600 font-medium" }, title),
          React.createElement("p", { className: "text-2xl font-bold text-gray-800" }, typeof value === 'number' && value > 1000 ? value.toLocaleString() : value)
        )
      ),
      change && React.createElement(
        "div",
        {
          className: `flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`
        },
        trend === 'up' ? React.createElement(TrendingUp, { size: 12 }) : React.createElement(TrendingDown, { size: 12 }),
        Math.abs(change) + '%'
      )
    ),
    React.createElement(
      "div",
      { className: "h-1 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full overflow-hidden" },
      React.createElement(
        motion.div,
        {
          initial: { width: 0 },
          animate: { width: `${Math.min(100, (value / 100) * 10)}%` },
          transition: { delay: delay + 0.5, duration: 1.5, ease: "easeOut" },
          className: "h-full bg-gradient-to-r from-purple-500 to-blue-500"
        }
      )
    )
  );
}

// Reusable DataTable component with React.createElement
function DataTable({ title, data, columns, delay = 0 }) {
  return React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, type: "spring", damping: 20, stiffness: 300 },
      className: "bg-white/80 backdrop-blur-xl rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300"
    },
    React.createElement(
      "div",
      { className: "p-6 border-b border-purple-100 flex items-center justify-between" },
      React.createElement("h3", { className: "text-lg font-bold text-gray-800" }, title),
      React.createElement(
        motion.button,
        {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          className: "text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
        },
        "View All ",
        React.createElement(ArrowUpRight, { size: 14 })
      )
    ),
    React.createElement(
      "div",
      { className: "overflow-x-auto" },
      React.createElement(
        "table",
        { className: "w-full table-auto min-w-max" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            { className: "border-b border-purple-50" },
            columns.map((col) =>
              React.createElement(
                "th",
                { key: col.key, className: "px-6 py-4 text-left text-sm font-semibold text-gray-700" },
                col.title
              )
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          data.slice(0, 5).map((item, idx) =>
            React.createElement(
              motion.tr,
              {
                key: idx,
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: delay + idx * 0.1 },
                whileHover: { backgroundColor: "#faf5ff" },
                className: "border-b border-purple-50 hover:bg-purple-50/50 transition-colors cursor-pointer"
              },
              columns.map((col) =>
                React.createElement(
                  "td",
                  { key: col.key, className: "px-6 py-4 text-sm text-gray-800" },
                  col.key === "revenue" ? `₹${item[col.key]?.toLocaleString()} `: item[col.key]
                )
              )
            )
          )
        )
      )
    )
  );
}

// Generic filter helper for all tables
function filterBySearch(items, searchTerm, keys = null) {
  if (!searchTerm.trim()) return items;
  const term = searchTerm.toLowerCase();
  return items.filter((item) =>
    (keys || Object.keys(item)).some(
      (key) =>
        item[key] !== undefined &&
        item[key] !== null &&
        item[key].toString().toLowerCase().includes(term)
    )
  );
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last30days");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 1);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredProductCategories = useMemo(
    () => filterBySearch(topProductCategories, searchTerm, ["category"]),
    [searchTerm]
  );
  const filteredTopProducts = useMemo(
    () => filterBySearch(topProducts, searchTerm, ["product"]),
    [searchTerm]
  );
  const filteredTopCustomers = useMemo(
    () => filterBySearch(topCustomers, searchTerm, ["customer"]),
    [searchTerm]
  );
  const filteredRecentOrders = useMemo(
    () =>
      filterBySearch(
        topProducts.map((p) => ({
          order: `#${1000 + Math.floor(Math.random() * 9000)}`,
          product: p.product,
          revenue: p.revenue,
        })),
        searchTerm,
        ["order", "product"]
      ),
    [searchTerm]
  );

  function handleSelectPeriod(value) {
    setSelectedPeriod(value);
    setShowPeriodDropdown(false);
    // Optional: implement filtering logic by period if you have date data
  }

  return React.createElement(
    "div",
    { className: "min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100" },

    // Navbar
    React.createElement(
      "nav",
      {
        className: `sticky top-0 z-40 w-full border-b border-purple-100 backdrop-blur-md bg-white transition-shadow ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`,
      },
      React.createElement(
        "div",
        { className: "max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" },
        React.createElement(
          "div",
          { className: "flex items-center space-x-4" },
          React.createElement(
            motion.div,
            {
              className:
                "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600 text-white",
              whileHover: { rotate: 180, scale: 1.1 },
              transition: { duration: 0.3 },
            },
            React.createElement(Zap, { size: 24 })
          ),
          React.createElement("span", { className: "text-xl font-extrabold text-purple-700" }, "RentHub")
        ),
        React.createElement(
          "div",
          { className: "hidden md:flex space-x-8" },
          navigationTabs.map((tab) =>
            React.createElement(
              motion.button,
              {
                key: tab.id,
                onClick: () => setActiveTab(tab.id),
                className: `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-purple-100"
                }`,
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
              },
              React.createElement(tab.icon, { size: 18 }),
              React.createElement("span", null, tab.label)
            )
          )
        ),
        React.createElement(
          "div",
          { className: "flex items-center space-x-4" },
          React.createElement(
            motion.div,
            {
              className:
                "w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600 text-white",
              whileHover: { scale: 1.1 },
            },
            React.createElement(User, { size: 20 })
          ),
          React.createElement("span", { className: "hidden sm:block font-medium text-gray-700" }, "Adam")
        )
      )
    ),

    // Controls: Search and Period dropdown
    React.createElement(
      motion.div,
      {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { type: "spring", damping: 20, stiffness: 300 },
        className: "flex flex-col sm:flex-row gap-4 max-w-7xl mx-auto px-4 py-6",
      },
      React.createElement(
        "div",
        { className: "relative w-full max-w-md" },
        React.createElement(
          "div",
          { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" },
          React.createElement(Search, { size: 20, className: "text-gray-400" })
        ),
        React.createElement("input", {
          type: "text",
          placeholder: "Search all tables...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          className:
            "w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500",
        })
      ),
      React.createElement(
        "div",
        { className: "relative" },
        React.createElement(
          motion.button,
          {
            className:
              "flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-purple-50",
            onClick: () => setShowPeriodDropdown(!showPeriodDropdown),
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
          },
          React.createElement("span", null, periodOptions.find((p) => p.value === selectedPeriod)?.label || "Select period"),
          React.createElement(ChevronDown, {
            className: showPeriodDropdown ? "rotate-180 transition-transform" : "transition-transform",
            size: 16,
          })
        ),
        React.createElement(
          AnimatePresence,
          null,
          showPeriodDropdown &&
            React.createElement(
              motion.div,
              {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                transition: { type: "spring", damping: 20, stiffness: 250 },
                className: "absolute right-0 top-full mt-2 rounded-md border border-gray-300 bg-white shadow-lg w-48 z-50",
              },
              periodOptions.map((option) =>
                React.createElement(
                  motion.button,
                  {
                    key: option.value,
                    className: `block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-purple-50 ${
                      selectedPeriod === option.value ? "bg-purple-100 font-semibold text-purple-700" : "text-gray-700"
                    }`,
                    onClick: () => {
                      handleSelectPeriod(option.value);
                    },
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                  },
                  option.label
                )
              )
            )
        )
      )
    ),

    // Stats Cards
    React.createElement(
      "div",
      { className: "grid max-w-7xl grid-cols-1 gap-6 px-4 pb-8 md:grid-cols-3 mx-auto" },
      React.createElement(StatCard, {
        title: "Quotations",
        value: dashboardStats.quotations.value,
        change: dashboardStats.quotations.change,
        trend: dashboardStats.quotations.trend,
        icon: FileText,
        delay: 0,
      }),
      React.createElement(StatCard, {
        title: "Rentals",
        value: dashboardStats.rentals.value,
        change: dashboardStats.rentals.change,
        trend: dashboardStats.rentals.trend,
        icon: ShoppingCart,
        delay: 0.2,
      }),
      React.createElement(StatCard, {
        title: "Revenue",
        value: dashboardStats.revenue.value,
        change: dashboardStats.revenue.change,
        trend: dashboardStats.revenue.trend,
        icon: DollarSign,
        delay: 0.4,
      })
    ),

    // Tables Grid
    React.createElement(
      "div",
      { className: "grid max-w-7xl grid-cols-1 gap-6 px-4 pb-10 lg:grid-cols-2 mx-auto" },
      React.createElement(DataTable, {
        title: "Top Product Categories",
        columns: [
          { key: "category", title: "Category" },
          { key: "ordered", title: "Ordered" },
          { key: "revenue", title: "Revenue" },
        ],
        data: filteredProductCategories,
        delay: 0.6,
      }),
      React.createElement(DataTable, {
        title: "Top Products",
        columns: [
          { key: "product", title: "Product" },
          { key: "ordered", title: "Ordered" },
          { key: "revenue", title: "Revenue" },
        ],
        data: filteredTopProducts,
        delay: 0.8,
      }),
      React.createElement(DataTable, {
        title: "Top Customers",
        columns: [
          { key: "customer", title: "Customer" },
          { key: "ordered", title: "Ordered" },
          { key: "revenue", title: "Revenue" },
        ],
        data: filteredTopCustomers,
        delay: 1.0,
      }),
      React.createElement(DataTable, {
        title: "Recent Orders",
        columns: [
          { key: "order", title: "Order ID" },
          { key: "product", title: "Product" },
          { key: "revenue", title: "Amount" },
        ],
        data: filteredRecentOrders,
        delay: 1.2,
      })
    )
  );

  function handleSelectPeriod(value) {
    setSelectedPeriod(value);
    setShowPeriodDropdown(false);
    // Implement period filtering logic if you have date-related data
  }
}





// Export function to attach event listeners
export function attachDashboardListeners() {
  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      console.log("Dashboard refreshed!");
    });
  }
}