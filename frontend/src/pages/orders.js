import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ShoppingCart,
  Package,
  FileText,
  Settings,
  User,
  Zap,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  Grid3X3,
  List,
  Menu,
  X,
  BarChart3
} from "lucide-react";

// Navigation tabs with icons
const navigationTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, isActive: false },
  { id: 'rental', label: 'Rental', icon: ShoppingCart },
  { id: 'order', label: 'Order', icon: Package, isActive: true },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'reporting', label: 'Reporting', icon: FileText },
];

// Rental and Invoice status filter metadata
const rentalStatusList = [
  { key: 'all', label: 'ALL', count: 16 },
  { key: 'quotation', label: 'Quotation', count: 3 },
  { key: 'reserved', label: 'Reserved', count: 8 },
  { key: 'pickedup', label: 'Pickedup', count: 4 },
  { key: 'returned', label: 'Returned', count: 1 }
];

const invoiceStatusList = [
  { key: 'fullyInvoiced', label: 'Fully Invoiced', count: 5 },
  { key: 'nothingToInvoice', label: 'Nothing to invoice', count: 5 },
  { key: 'toInvoice', label: 'To invoice', count: 5 }
];

// Status colors
const rentalStatusMeta = {
  quotation: 'bg-blue-100 text-blue-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  pickedup: 'bg-purple-100 text-purple-800',
  returned: 'bg-green-100 text-green-800'
};

const invoiceStatusColor = {
  fullyInvoiced: 'bg-green-100 text-green-700',
  nothingToInvoice: 'bg-gray-100 text-gray-600',
  toInvoice: 'bg-yellow-100 text-yellow-800'
};

// Mock rental orders data
const rentalOrders = [
  { id: 'RO001', customer: 'Customer1', amount: 2000, status: 'quotation', invoiceStatus: 'toInvoice', date: '08/09/2025 20:34', isLatePickup: false },
  { id: 'RO002', customer: 'Customer2', amount: 1000, status: 'pickedup', invoiceStatus: 'nothingToInvoice', date: '08/10/2025 08:34', isLatePickup: true },
  { id: 'RO003', customer: 'Customer3', amount: 3000, status: 'returned', invoiceStatus: 'fullyInvoiced', date: '08/07/2025 10:34', isLatePickup: false },
  { id: 'RO004', customer: 'Customer4', amount: 1500, status: 'reserved', invoiceStatus: 'toInvoice', date: '08/11/2025 14:22', isLatePickup: false },
  { id: 'RO005', customer: 'Customer5', amount: 2500, status: 'quotation', invoiceStatus: 'nothingToInvoice', date: '08/12/2025 09:15', isLatePickup: false },
  { id: 'RO006', customer: 'Customer6', amount: 1800, status: 'pickedup', invoiceStatus: 'fullyInvoiced', date: '08/13/2025 16:45', isLatePickup: true },
  { id: 'RO007', customer: 'Customer7', amount: 3500, status: 'returned', invoiceStatus: 'fullyInvoiced', date: '08/14/2025 11:30', isLatePickup: false },
  { id: 'RO008', customer: 'Customer7', amount: 3500, status: 'returned', invoiceStatus: 'fullyInvoiced', date: '08/14/2025 11:30', isLatePickup: false },
  { id: 'RO009', customer: 'Customer8', amount: 2200, status: 'reserved', invoiceStatus: 'toInvoice', date: '08/15/2025 13:20', isLatePickup: false },
  { id: 'RO0010', customer: 'Customer7', amount: 3500, status: 'returned', invoiceStatus: 'fullyInvoiced', date: '08/14/2025 11:30', isLatePickup: false },
];

const PAGE_SIZE = 9;

function Navbar() {
  return React.createElement(
    'header',
    { className: 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border-b border-gray-200 px-6 py-4' },
    React.createElement(
      'div',
      { className: 'flex items-center justify-between' },
      React.createElement(
        'div',
        { className: 'flex items-center gap-8' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-3' },
          React.createElement(
            'div',
            { className: 'w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center' },
            React.createElement(Zap, { size: 24, className: 'text-white' })
          ),
          React.createElement('h1', { className: 'text-xl font-extrabold text-purple-700' }, 'RentHub')
        ),
        React.createElement(
          'nav',
          { className: 'flex items-center gap-1' },
          navigationTabs.map(tab =>
            React.createElement(
              'button',
              {
                key: tab.id,
                className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab.isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              },
              React.createElement(tab.icon, { size: 18 }),
              tab.label
            )
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
  );
}

function Sidebar({ isExpanded, toggleSidebar, selectedRentalStatus, setSelectedRentalStatus, selectedInvoiceStatus, setSelectedInvoiceStatus }) {
  return React.createElement(
    motion.div,
    {
      initial: false,
      animate: { width: isExpanded ? 280 : 64 },
      transition: { duration: 0.3, ease: "easeInOut" },
      className: "bg-white border-r border-gray-200 h-full flex flex-col relative"
    },
    React.createElement(
      'div',
      { className: 'p-4 border-b border-gray-200' },
      React.createElement(
        'button',
        {
          onClick: toggleSidebar,
          className: 'w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
        },
        isExpanded 
          ? React.createElement(ChevronLeft, { size: 16 })
          : React.createElement(Menu, { size: 16 })
      )
    ),
    React.createElement(
      'div',
      { className: 'flex-1 p-4' },
      React.createElement(
        'div',
        { className: 'space-y-2' },
        isExpanded && React.createElement(
          'h3',
          { className: 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3' },
          'Rental Status'
        ),
        rentalStatusList.map(status =>
          React.createElement(
            'button',
            {
              key: status.key,
              onClick: () => setSelectedRentalStatus(status.key),
              className: `w-full rounded-lg px-3 py-2 text-left transition-colors ${
                selectedRentalStatus === status.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            },
            React.createElement(
              'div',
              { className: 'flex items-center gap-3' },
              React.createElement(
                'div',
                { className: `w-3 h-3 rounded-full ${selectedRentalStatus === status.key ? 'bg-blue-500' : 'bg-gray-300'} `}
              ),
              isExpanded && React.createElement(
                'div',
                { className: 'flex items-center justify-between flex-1' },
                React.createElement('span', { className: 'text-sm font-medium' }, status.label),
                React.createElement('span', { className: 'text-xs px-2 py-1 bg-gray-100 rounded-full' }, status.count)
              )
            )
          )
        ),
        React.createElement('div', { className: 'my-4 border-t border-gray-200' }),
        isExpanded && React.createElement(
          'h3',
          { className: 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3' },
          'Invoice Status'
        ),
        invoiceStatusList.map(status =>
          React.createElement(
            'button',
            {
              key: status.key,
              onClick: () => setSelectedInvoiceStatus(selectedInvoiceStatus === status.key ? null : status.key),
              className: `w-full rounded-lg px-3 py-2 text-left transition-colors ${
                selectedInvoiceStatus === status.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            },
            React.createElement(
              'div',
              { className: 'flex items-center gap-3' },
              React.createElement(
                'div',
                { className: `w-3 h-3 rounded-full ${selectedInvoiceStatus === status.key ? 'bg-blue-500' : 'bg-gray-300'}` }
              ),
              isExpanded && React.createElement(
                'div',
                { className: 'flex items-center justify-between flex-1' },
                React.createElement('span', { className: 'text-sm font-medium' }, status.label),
                React.createElement('span', { className: 'text-xs px-2 py-1 bg-gray-100 rounded-full' }, status.count)
              )
            )
          )
        )
      )
    )
  );
}

function RentalOrderCard({ order, idx }) {
  const statusColor = rentalStatusMeta[order.status] || "bg-gray-100 text-gray-800";
  const invoiceColor = invoiceStatusColor[order.invoiceStatus] || "bg-gray-100 text-gray-700";

  return React.createElement(
    motion.div,
    {
      key: order.id,
      className: "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: idx * 0.1, duration: 0.3 }
    },
    React.createElement(
      'div',
      { className: 'flex justify-between items-start mb-4' },
      React.createElement(
        'div',
        null,
        React.createElement('h4', { className: 'font-semibold text-gray-900 text-lg' }, order.customer),
        React.createElement('p', { className: 'text-sm text-gray-500' }, order.id)
      ),
      React.createElement(
        'span',
        { 
          className: `px-3 py-1 rounded-full text-xs font-medium ${statusColor} ${
            order.isLatePickup ? 'ring-2 ring-red-200 bg-red-50 text-red-700' : ''
          }`
        },
        order.status.charAt(0).toUpperCase() + order.status.slice(1),
        order.isLatePickup && ' (Late)'
      )
    ),
    React.createElement(
      'div',
      { className: 'mb-4' },
      React.createElement('div', { className: 'text-2xl font-bold text-gray-900' },`₹${order.amount.toLocaleString()}`)
    ),
    React.createElement(
      'div',
      { className: 'flex items-center justify-between text-sm' },
      React.createElement(
        'span',
        { className:` px-2 py-1 rounded-md font-medium ${invoiceColor} `},
        order.invoiceStatus === 'fullyInvoiced' ? 'Fully Invoiced'
          : order.invoiceStatus === 'nothingToInvoice' ? 'Nothing to invoice'
            : 'To invoice'
      ),
      React.createElement('span', { className: 'text-gray-500' }, order.date)
    )
  );
}

export default function OrderPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedRentalStatus, setSelectedRentalStatus] = useState('all');
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const [page, setPage] = useState(1);

  // Filtered rental orders
  const filteredOrders = useMemo(() => {
    let orders = rentalOrders;

    if (selectedRentalStatus !== 'all') {
      orders = orders.filter(o => o.status === selectedRentalStatus);
    }
    if (selectedInvoiceStatus) {
      orders = orders.filter(o => o.invoiceStatus === selectedInvoiceStatus);
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      orders = orders.filter(
        o => o.customer.toLowerCase().includes(term) || o.id.toLowerCase().includes(term)
      );
    }
    return orders;
  }, [selectedRentalStatus, selectedInvoiceStatus, searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const pagedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return React.createElement(
    'div',
    { className: 'flex h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100' },
    React.createElement(
      'div',
      { className: 'flex flex-col w-full' },
      React.createElement(Navbar),
      React.createElement(
        'div',
        { className: 'flex flex-1 overflow-hidden' },
        React.createElement(Sidebar, {
          isExpanded: sidebarExpanded,
          toggleSidebar: () => setSidebarExpanded(!sidebarExpanded),
          selectedRentalStatus,
          setSelectedRentalStatus,
          selectedInvoiceStatus,
          setSelectedInvoiceStatus
        }),
        React.createElement(
          'div',
          { className: 'flex-1 overflow-auto p-6' },
          React.createElement(
            'div',
            { className: 'mb-6 flex items-center gap-4' },
            React.createElement(
              'div',
              { className: 'relative flex-1 max-w-md' },
              React.createElement(Search, { size: 20, className: 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' }),
              React.createElement('input', {
                type: 'text',
                value: searchTerm,
                onChange: e => setSearchTerm(e.target.value),
                placeholder: 'Search all tables...',
                className: 'w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              })
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-1' },
              React.createElement(
                'button',
                {
                  onClick: () => setViewType('grid'),
                  className: `p-2 rounded-md transition-colors ${
                    viewType === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`
                },
                React.createElement(Grid3X3, { size: 18 })
              ),
              React.createElement(
                'button',
                {
                  onClick: () => setViewType('list'),
                  className: `p-2 rounded-md transition-colors ${
                    viewType === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`
                },
                React.createElement(List, { size: 18 })
              )
            ),
            
          ),
          React.createElement(
            'div',
            { className: viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4' },
            pagedOrders.map((order, idx) => 
              React.createElement(RentalOrderCard, { key: order.id, order, idx })
            )
          ),
          filteredOrders.length > 0 && React.createElement(
            'div',
            { className: 'flex justify-between items-center mt-8' },
            React.createElement(
              'p',
              { className: 'text-sm text-gray-500' },
              `Showing ${((page - 1) * PAGE_SIZE) + 1} to ${Math.min(page * PAGE_SIZE, filteredOrders.length)} of ${filteredOrders.length} results`
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-2' },
              React.createElement(
                'button',
                {
                  onClick: () => setPage(p => Math.max(1, p - 1)),
                  disabled: page === 1,
                  className: 'p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                },
                React.createElement(ChevronLeft, { size: 16 })
              ),
              React.createElement(
                'span',
                { className: 'px-4 py-2 text-sm font-medium' },
                `Page ${page} of ${totalPages}`
              ),
              React.createElement(
                'button',
                {
                  onClick: () => setPage(p => Math.min(totalPages, p + 1)),
                  disabled: page >= totalPages,
                  className: 'p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                },
                React.createElement(ChevronRight, { size: 16 })
              )
            )
          )
        )
      )
    )
  );
}




export function attachOrdersListeners() {
  const createBtn = document.getElementById("create-order-btn");
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      console.log("Create Order button clicked");
      // TODO: Add logic to open create order modal or navigate to create order page
    });
  }
}