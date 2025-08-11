import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  ShoppingCart,
  Heart,
  User,
  Phone,
  ChevronDown,
  Calendar,
  Plus,
  Minus,
  Share2,
  ChevronRight,
  Package,
  Bookmark,
  Zap,
} from "lucide-react";

// Navigation items
const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'rental', label: 'Rental Shop', icon: ShoppingCart, isActive: true },
  { id: 'wishlist', label: 'Wishlist', icon: Heart }
];

// Mock product data
const productData = {
  id: 'P001',
  name: 'Professional Camera Kit',
  price: 1000,
  pricePerUnit: 500,
  image: '/api/placeholder/300/300',
  description: [
    'High-quality professional camera with advanced features',
    'Includes multiple lenses and accessories',
    'Perfect for photography and videography projects',
    'Available for short-term and long-term rentals'
  ],
  termsAndConditions: [
    'Minimum rental period: 1 day',
    'Security deposit required',
    'Late return charges apply',
    'Equipment must be returned in original condition'
  ]
};

function Navbar({ cartCount }) {
  return React.createElement(
    'header',
    { className: 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border-b border-gray-200 px-6 py-4' },
    React.createElement(
      'div',
      { className: 'flex items-center justify-between max-w-7xl mx-auto' },
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
          navigationItems.map(item =>
            React.createElement(
              'button',
              {
                key: item.id,
                className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.isActive 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                }`
              },
              React.createElement(item.icon, { size: 18 }),
              item.label
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'flex items-center gap-4' },
        React.createElement(
                    motion.button,
                    {
                      whileHover: { scale: 1.1, rotate: 5 },
                      whileTap: { scale: 0.9 },
                      className: "p-2 hover:bg-purple-50 rounded-lg transition-colors relative"
                    },
                    React.createElement(ShoppingCart, { size: 20, className: "text-gray-700" }),
                    React.createElement(
                      "span",
                      { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" },
                      "3"
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
                      ),
        React.createElement(
          'button',
          { className: 'flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50' },
          React.createElement(Phone, { size: 16 }),
          'Contact us'
        )
      )
    )
  );
}

function Breadcrumb({ productName }) {
  return React.createElement(
    'div',
    { className: 'flex items-center gap-2 text-sm text-gray-600 mb-6' },
    React.createElement(
      'button',
      { className: 'hover:text-blue-600 transition-colors' },
      'All Products'
    ),
    React.createElement(ChevronRight, { size: 16 }),
    React.createElement('span', { className: 'text-gray-900 font-medium' }, productName)
  );
}

function ProductImage() {
  return React.createElement(
    'div',
    { className: 'bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300' },
    React.createElement(
      'div',
      { className: 'text-center' },
      React.createElement(
        'div',
        { className: 'w-24 h-24 bg-white rounded-lg border border-gray-300 mx-auto mb-4 flex items-center justify-center' },
        React.createElement(
          'div',
          { className: 'w-12 h-12 bg-gray-200 rounded flex items-center justify-center' },
          React.createElement(Bookmark, { size: 20, className: 'text-gray-400' })
        )
      )
    ),
    // Styled Add to Wishlist button
    React.createElement(
      'button',
      {
        className:
          'w-full mt-4 py-3 rounded-lg bg-white border border-gray-200 flex justify-center items-center gap-2 text-gray-700 font-medium shadow hover:bg-gray-50 transition-colors',
        style: { maxWidth: '300px' }
      },
    //   React.createElement(Heart, { size: 18, className: '-600' }),
      'Add to wishlist'
    )
  );
}

function ProductDetails({
  product,
  quantity,
  setQuantity,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  couponCode,
  setCouponCode,
  onAddToCart
}) {
  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return React.createElement(
    'div',
    { className: 'space-y-6' },
    React.createElement(
      'div',
      { className: 'flex items-center justify-between' },
      React.createElement('h1', { className: 'text-2xl font-bold text-gray-900' }, product.name),
      React.createElement(
        'button',
        { className: 'flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50' },
        'Price List',
        React.createElement(ChevronDown, { size: 16 })
      )
    ),
    React.createElement(
      'div',
      { className: 'space-y-2' },
      React.createElement('div', { className: 'text-3xl font-bold text-gray-900' }, `₹ ${product.price}`),
      React.createElement('div', { className: 'text-gray-600' }, `₹${product.pricePerUnit} / per unit `)
    ),
    React.createElement(
      'div',
      { className: 'grid grid-cols-2 gap-4' },
      React.createElement(
        'div',
        null,
        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'From :'),
        React.createElement(
          'div',
          { className: 'relative' },
          React.createElement('input', {
            type: 'date',
            value: fromDate,
            onChange: (e) => setFromDate(e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          }),
          React.createElement(Calendar, { size: 16, className: 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' })
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'to :'),
        React.createElement(
          'div',
          { className: 'relative' },
          React.createElement('input', {
            type: 'date',
            value: toDate,
            onChange: (e) => setToDate(e.target.value),
            className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          }),
          React.createElement(Calendar, { size: 16, className: 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' })
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'flex items-center gap-4' },
      React.createElement(
        'div',
        { className: 'flex items-center border border-gray-300 rounded-lg' },
        React.createElement(
          'button',
          {
            onClick: () => handleQuantityChange(-1),
            className: 'p-2 hover:bg-gray-50 transition-colors'
          },
          React.createElement(Minus, { size: 16 })
        ),
        React.createElement('span', { className: 'px-4 py-2 font-medium' }, quantity),
        React.createElement(
          'button',
          {
            onClick: () => handleQuantityChange(1),
            className: 'p-2 hover:bg-gray-50 transition-colors'
          },
          React.createElement(Plus, { size: 16 })
        )
      ),
      React.createElement(
        motion.button,
        {
          onClick: onAddToCart,
          className: 'flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors',
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 }
        },
        React.createElement(Heart, { size: 16 }),
        'Add to Cart'
      )
    ),
    React.createElement(
      'div',
      { className: 'space-y-3' },
      React.createElement('h3', { className: 'font-semibold text-gray-900' }, 'Apply Coupon'),
      React.createElement(
        'div',
        { className: 'flex gap-2' },
        React.createElement('input', {
          type: 'text',
          value: couponCode,
          onChange: (e) => setCouponCode(e.target.value),
          placeholder: 'Coupon Code',
          className: 'flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        }),
        React.createElement(
          'button',
          { className: 'px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors' },
          'Apply'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'space-y-3' },
      React.createElement('h3', { className: 'font-semibold text-gray-900' }, 'Terms & condition'),
      React.createElement(
        'div',
        { className: 'space-y-1 text-sm text-gray-600' },
        product.termsAndConditions.map((term, index) =>
          React.createElement('div', { key: index }, `• ${term}`)
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'space-y-3' },
      React.createElement('h3', { className: 'font-semibold text-gray-900' }, 'Share :'),
      React.createElement(
        'button',
        { className: 'flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors' },
        React.createElement(Share2, { size: 16 }),
        'Share Product'
      )
    )
  );
}

function ProductDescription({ product }) {
  const [showMore, setShowMore] = useState(false);
  return React.createElement(
    'div',
    { className: 'bg-white rounded-lg border border-gray-200 p-6' },
    React.createElement('h3', { className: 'font-semibold text-gray-900 mb-4' }, 'Product descriptions'),
    React.createElement(
      'div',
      { className: 'space-y-2 text-sm text-gray-600' },
      product.description.slice(0, showMore ? product.description.length : 3).map((desc, index) =>
        React.createElement('div', { key: index }, ` • ${desc}`)
      ),
      !showMore && product.description.length > 3 && React.createElement('div', null, '• ...')
    ),
    React.createElement(
      'button',
      {
        onClick: () => setShowMore(!showMore),
        className: 'mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1'
      },
      showMore ? 'Read Less' : 'Read More',
      React.createElement(ChevronRight, { size: 14, className: showMore ? 'rotate-90' : '' })
    )
  );
}

export default function LoginRental() {
  const [quantity, setQuantity] = useState(2);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    if (!fromDate || !toDate) {
      alert('Please select rental dates');
      return;
    }
    setCartCount(prev => prev + quantity);
  };

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-50' },
    React.createElement(Navbar, { cartCount }),
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto px-6 py-8' },
      React.createElement(Breadcrumb, { productName: productData.name }),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 lg:grid-cols-2 gap-12' },
        React.createElement(
          'div',
          null,
          React.createElement(ProductImage),
          React.createElement(
            'div',
            { className: 'mt-8' },
            React.createElement(ProductDescription, { product: productData })
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(ProductDetails, {
            product: productData,
            quantity,
            setQuantity,
            fromDate,
            setFromDate,
            toDate,
            setToDate,
            couponCode,
            setCouponCode,
            onAddToCart: handleAddToCart
          })
        )
      )
    )
  );
}

export function attachLoginRentalListeners() {
  console.log("LoginRental component loaded");
}
