import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  ShoppingCart,
  User,
  ChevronRight,
  FileText,
  Package
} from "lucide-react";

// Reuse Navbar from Cart/LoginRental
function Navbar({ cartCount }) {
  return React.createElement(
    "header",
    { className: "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border-b border-gray-200 px-6 py-4" },
    React.createElement(
      "div",
      { className: "flex items-center justify-between max-w-7xl mx-auto" },
      React.createElement(
        "div",
        { className: "flex items-center gap-8" },
        React.createElement(
          "div",
          { className: "flex items-center gap-3" },
          React.createElement(
            "div",
            { className: "w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" },
            React.createElement(Package, { size: 24, className: "text-white" })
          ),
          React.createElement("h1", { className: "text-xl font-extrabold text-purple-700" }, "RentHub")
        )
      ),
      React.createElement(
        "div",
        { className: "flex items-center gap-4" },
        React.createElement(
          "button",
          { className: "p-2 rounded-lg border border-gray-300 hover:bg-gray-50 relative" },
          React.createElement(ShoppingCart, { size: 20, className: "text-gray-700" }),
          cartCount > 0 &&
            React.createElement(
              "span",
              { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" },
              cartCount
            )
        ),
        React.createElement(
          "div",
          { className: "flex items-center space-x-4" },
          React.createElement(
            "div",
            {
              className: "w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600 text-white"
            },
            React.createElement(User, { size: 20 })
          ),
          React.createElement("span", { className: "hidden sm:block font-medium text-gray-700" }, "Adam")
        )
      )
    )
  );
}

// --- Main Delivery Details Page
export default function DeliveryDetails() {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [billingSame, setBillingSame] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Mock values
  const itemCount = 2;
  const subTotal = 4000;
  const taxes = 30;
  const deliveryCharge = 0;
  const total = subTotal + taxes + deliveryCharge;

  // Delivery methods (mock)
  const deliveryOptions = [
    { value: "", label: "Please pick something" },
    { value: "home", label: "Home Delivery (Free)" },
    { value: "store_pickup", label: "Store Pickup" }
  ];

  // Coupon logic
  function handleApplyCoupon() {
    if (coupon.trim() === "RENT10") {
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
    }
  }

  // Handles billing toggle
  function handleBillingToggle() {
    setBillingSame(!billingSame);
    if (billingSame) setInvoiceAddress(""); // clear invoice when toggled off
  }

  // --- The main responsive grid
  return React.createElement(
    "div",
    { className: "min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100" },
    React.createElement(Navbar, { cartCount: 2 }),
    React.createElement(
      "div",
      { className: "max-w-5xl mx-auto px-4 py-8" },
      React.createElement(
        "div",
        { className: "text-xs text-gray-500 mb-5 flex items-center gap-2" },
        "Review Order", React.createElement(ChevronRight, { size: 16 }),
        "Delivery", React.createElement(ChevronRight, { size: 16 }),
        "Payment"
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 gap-8" },

        // Left: Address forms
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "mb-6" },
            React.createElement("h2", { className: "text-lg font-bold text-purple-700 mb-3" }, "Delivery Address"),
            React.createElement("textarea", {
              value: deliveryAddress,
              onChange: e => setDeliveryAddress(e.target.value),
              rows: 2,
              placeholder: "Enter delivery address...",
              className: "w-full p-3 rounded-lg border border-gray-300 resize-none mb-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            }),
            React.createElement(
              "div",
              { className: "mt-4" },
              React.createElement(
                "label",
                { className: "flex items-center gap-2 mb-3 cursor-pointer" },
                React.createElement("input", {
                  type: "checkbox",
                  checked: billingSame,
                  onChange: handleBillingToggle,
                  className: "accent-purple-600"
                }),
                React.createElement("span", { className: "text-sm text-blue-700" }, "Billing address same as delivery address")
              )
            ),
            !billingSame &&
              React.createElement(
                "div",
                null,
                React.createElement("h2", { className: "text-lg font-bold text-purple-700 mb-3" }, "Invoice Address"),
                React.createElement("textarea", {
                  value: invoiceAddress,
                  onChange: e => setInvoiceAddress(e.target.value),
                  rows: 2,
                  placeholder: "Enter invoice/billing address...",
                  className: "w-full p-3 rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-purple-400 focus:outline-none"
                })
              )
          ),

          React.createElement(
            "div",
            { className: "mb-6" },
            React.createElement(
              "label",
              { className: "font-medium text-sm text-gray-700 block mb-2" },
              "Choose Delivery Method"
            ),
            React.createElement(
              "select",
              {
                value: deliveryMethod,
                onChange: e => setDeliveryMethod(e.target.value),
                className: "w-full p-2 rounded-lg border border-gray-300 bg-white shadow focus:ring-2 focus:ring-blue-400"
              },
              deliveryOptions.map(opt =>
                React.createElement(
                  "option",
                  { key: opt.value, value: opt.value },
                  opt.label
                )
              )
            ),
            React.createElement(
              "div",
              { className: "text-xs text-blue-800 mt-2 flex items-center gap-1" },
              "Delivery charges:",
              React.createElement("span", { className: "font-bold" }, `₹${deliveryCharge}`)
            )
          )
        ),

        // Right: Order summary
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6" },
            React.createElement(
              "div",
              { className: "mb-4 flex items-center gap-2 justify-between" },
              React.createElement("h3", { className: "text-lg font-semibold text-blue-700" }, "Order Summary"),
              React.createElement(FileText, { size: 22, className: "text-purple-600" })
            ),
            React.createElement(
              "div",
              { className: "space-y-2 text-gray-700" },
              React.createElement("div", { className: "flex justify-between" }, React.createElement("span", null, `Items (${itemCount})`), React.createElement("span", null, `₹${subTotal}`)),
              React.createElement("div", { className: "flex justify-between" }, React.createElement("span", null, "Delivery"), React.createElement("span", null, deliveryCharge ? `₹${deliveryCharge}` : "-")),
              React.createElement("div", { className: "flex justify-between" }, React.createElement("span", null, "Taxes"), React.createElement("span", null, `₹${taxes}`)),
              React.createElement("div", { className: "border-t my-2" }),
              React.createElement(
                "div",
                { className: "flex justify-between font-bold text-blue-700 text-lg" },
                React.createElement("span", null, "Total"),
                React.createElement("span", null, `₹${total}`)
              )
            ),

            // Coupon controls
            React.createElement(
              "div",
              { className: "mt-6" },
              React.createElement(
                "label",
                { className: "block font-medium text-sm mb-2 text-purple-700" },
                "Apply Coupon"
              ),
              React.createElement(
                "div",
                { className: "flex gap-2 items-center" },
                React.createElement("input", {
                  type: "text",
                  value: coupon,
                  placeholder: "Coupon Code",
                  onChange: e => { setCoupon(e.target.value); setCouponApplied(false); },
                  className: "flex-1 px-3 py-2 border rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-400"
                }),
                React.createElement(
                  "button",
                  {
                    type: "button",
                    className: "px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors",
                    onClick: handleApplyCoupon
                  },
                  "Apply"
                )
              ),
              couponApplied &&
                React.createElement("div", { className: "text-green-700 text-xs mt-1" }, "Coupon Applied: RENT10!")
            ),
            React.createElement(
              "button",
              {
                className: "mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg text-lg shadow hover:from-blue-700 hover:to-purple-700 transition-colors",
                disabled: !deliveryAddress || (!billingSame && !invoiceAddress)
              },
              "Confirm"
            ),
            React.createElement(
              "button",
              {
                className: "mt-3 w-full py-3 bg-gray-100 text-gray-600 font-medium rounded-lg text-base border hover:bg-gray-200 transition-colors",
                type: "button"
              },
              "< Back to Cart"
            )
          )
        )
      )
    )
  );
}

export function attachDeliveryListeners() {
  // For additional event hooks, modal logic, etc.
  console.log("Delivery detail component loaded");
}
