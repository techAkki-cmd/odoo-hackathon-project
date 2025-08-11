import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Trash2,
  Plus,
  Minus,
  User,
  Phone,
  Zap
} from "lucide-react";

//
// ---- Navbar Component from LoginRental ----
//
const navigationItems = [
  { id: 'home', label: 'Home', icon: ShoppingCart },
  { id: 'rental', label: 'Rental Shop', icon: ShoppingCart, isActive: true },
  { id: 'wishlist', label: 'Wishlist', icon: Heart }
];

function Navbar({ cartCount }) {
  return React.createElement(
    'header',
    { className: 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border-b border-gray-200 px-6 py-4' },
    React.createElement(
      'div',
      { className: 'flex items-center justify-between max-w-7xl mx-auto' },

      // Logo + Nav
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

      // Cart + User + Contact
      React.createElement(
        'div',
        { className: 'flex items-center gap-4' },

        // Cart icon
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.1, rotate: 5 },
            whileTap: { scale: 0.9 },
            className: "p-2 hover:bg-purple-50 rounded-lg transition-colors relative"
          },
          React.createElement(ShoppingCart, { size: 20, className: "text-gray-700" }),
          cartCount > 0 &&
            React.createElement(
              "span",
              { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" },
              cartCount
            )
        ),

        // User profile
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

        // Contact button
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

//
// ---- Mock cart data ----
//
const initialCart = [
  { id: 1, name: "Professional Camera Kit", price: 1000, qty: 1, image: "/api/placeholder/300/300" },
  { id: 2, name: "Compact Tripod Stand", price: 500, qty: 2, image: "/api/placeholder/300/200" }
];

//
// ---- Main Cart Page ----
//
export default function CartPage() {
  const [cart, setCart] = useState(initialCart);
  const [coupon, setCoupon] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Totals
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = cart.length ? 0 : 0;
  const tax = Math.round(subTotal * 0.05);
  const total = subTotal + delivery + tax;

  // Handlers
  const handleQty = (id, delta) => {
    setCart(cart =>
      cart.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };
  const handleRemove = id => setCart(cart => cart.filter(item => item.id !== id));
  const handleWishlist = id => alert("Added to wishlist!");
  const handleCouponApply = () => setCouponSuccess(coupon.trim().toLowerCase() === "rent10");

  //
  // Cart item row
  //
  function CartItemRow({ item }) {
    return React.createElement(
      'div',
      { className: 'flex flex-col sm:flex-row items-center gap-6 bg-white rounded-xl border border-gray-200 mb-4 p-4 shadow transition' },
      React.createElement('img', { src: item.image, alt: item.name, className: 'w-24 h-24 object-cover rounded-lg border border-gray-200 mb-3 sm:mb-0' }),
      React.createElement(
        'div',
        { className: 'flex-1 w-full' },
        React.createElement('div', { className: 'font-semibold text-lg text-gray-800' }, item.name),
        React.createElement('div', { className: 'font-bold text-blue-700 text-xl mb-2' }, `₹${item.price.toLocaleString()}`),
        React.createElement(
          'div',
          { className: 'flex items-center gap-2 mt-2' },
          React.createElement(
            'button',
            { onClick: () => handleQty(item.id, -1), className: 'w-8 h-8 flex items-center justify-center rounded-md border text-gray-500 hover:bg-gray-50' },
            React.createElement(Minus, { size: 18 })
          ),
          React.createElement('span', { className: 'font-semibold text-gray-900 mx-2' }, item.qty),
          React.createElement(
            'button',
            { onClick: () => handleQty(item.id, 1), className: 'w-8 h-8 flex items-center justify-center rounded-md border text-gray-500 hover:bg-gray-50' },
            React.createElement(Plus, { size: 18 })
          ),
          React.createElement(
            'button',
            { onClick: () => handleWishlist(item.id), className: 'ml-3 rounded-md border p-2 text-pink-600 hover:bg-pink-50', title: "Add to wishlist" },
            React.createElement(Heart, { size: 16 })
          ),
          React.createElement(
            'button',
            { onClick: () => handleRemove(item.id), className: 'ml-1 rounded-md border p-2 text-gray-500 hover:bg-red-50 hover:text-red-600', title: "Remove" },
            React.createElement(Trash2, { size: 16 })
          )
        )
      )
    );
  }

  //
  // Order summary panel
  //
  function SummaryPanel() {
    return React.createElement(
      'div',
      { className: 'bg-white rounded-xl border border-blue-100 shadow p-6 mb-4 max-w-md w-full mx-auto sm:mx-0' },
      React.createElement('h2', { className: 'font-semibold text-lg mb-5 text-gray-800 border-b pb-3' }, 'Order Overview'),
      React.createElement(
        'div', { className: 'space-y-2 mb-4 text-gray-700' },
        React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', null, 'Delivery Charge'),
          React.createElement('span', null, delivery ? `₹${delivery}` : '-')
        ),
        React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', null, 'Sub Total'),
          React.createElement('span', null, `₹${subTotal.toLocaleString()}`)
        ),
        React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', null, 'Tax (5%)'),
          React.createElement('span', null, `₹${tax.toLocaleString()}`)
        )
      ),
      React.createElement('div', { className: 'border-t border-gray-200 my-2' }),
      React.createElement(
        'div', { className: 'flex justify-between font-bold text-lg mb-2' },
        React.createElement('span', null, 'Total'),
        React.createElement('span', { className: 'text-blue-700' }, `₹${total.toLocaleString()}`)
      ),
      React.createElement(
        'div', { className: 'flex gap-2 mt-4' },
        React.createElement('input', {
          type: "text",
          value: coupon,
          placeholder: "Coupon Code",
          onChange: e => {
            setCouponSuccess(false);
            setCoupon(e.target.value);
          },
          className: 'flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
        }),
        React.createElement(
          'button',
          { onClick: handleCouponApply, className: 'px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700' },
          'Apply'
        )
      ),
      couponSuccess && React.createElement(
        'div', { className: 'text-green-700 text-xs mt-1' }, 'Coupon Applied!'
      ),
      React.createElement(
        'button',
        {
          className: 'w-full mt-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg py-3 text-lg shadow hover:from-blue-700 hover:to-purple-700 transition-colors',
          disabled: !cart.length
        },
        cart.length ? "Proceed to checkout" : "Cart is empty"
      )
    );
  }

  //
  // Page layout
  //
  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100' },
    React.createElement(Navbar, { cartCount: cart.reduce((sum, i) => sum + i.qty, 0) }),
    React.createElement(
      'div', { className: 'max-w-7xl mx-auto px-4 py-8' },
      React.createElement(
        'div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },

        // Cart items
        React.createElement(
          'div', { className: 'md:col-span-2' },
          React.createElement('h1', { className: 'text-2xl font-bold mb-6 text-gray-900 flex items-center' },
            React.createElement(ShoppingCart, { size: 26, className: "mr-2 text-blue-600" }),
            'Your Cart'
          ),
          cart.length
            ? cart.map(item => React.createElement(CartItemRow, { key: item.id, item }))
            : React.createElement('div', { className: 'text-gray-500 text-xl text-center py-24' }, 'Your cart is empty!')
        ),

        // Summary panel
        React.createElement(
          'div', { className: 'md:col-span-1' },
          React.createElement(SummaryPanel)
        )
      )
    )
  );
}

export function attachCartListeners() {
  console.log("Cart page loaded");
}
