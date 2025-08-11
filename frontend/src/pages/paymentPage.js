import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Home,
  ShoppingCart,
  FileText,
  ChevronRight,
  Ticket,
} from "lucide-react";

// ---- Navbar ----
function Navbar({ cartCount }) {
  return React.createElement(
    "header",
    {
      className:
        "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border-b border-gray-200 px-6 py-4",
    },
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
            {
              className:
                "w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center",
            },
            React.createElement(Home, { size: 24, className: "text-white" })
          ),
          React.createElement(
            "h1",
            { className: "text-xl font-extrabold text-purple-700" },
            "RentHub"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "flex items-center gap-4" },
        React.createElement(
          "button",
          {
            className:
              "p-2 rounded-lg border border-gray-300 hover:bg-gray-50 relative",
          },
          React.createElement(ShoppingCart, {
            size: 20,
            className: "text-gray-700",
          }),
          cartCount > 0 &&
            React.createElement(
              "span",
              {
                className:
                  "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center",
              },
              cartCount
            )
        ),
        React.createElement(
          "div",
          { className: "flex items-center space-x-4" },
          React.createElement(
            "div",
            {
              className:
                "w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600 text-white",
            },
            React.createElement(User, { size: 20 })
          ),
          React.createElement(
            "span",
            { className: "hidden sm:block font-medium text-gray-700" },
            "Adam"
          )
        )
      )
    )
  );
}

// ---- Order data (mock) ----
const orderItems = [
  { name: "Professional Camera Kit", price: 3000 },
  { name: "Tripod Stand", price: 1000 },
];

// ---- PaymentPage with PayPal integration ----
export default function PaymentPage() {
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const paypalRef = useRef(null);

  const subTotal = orderItems.reduce((sum, i) => sum + i.price, 0);
  const taxes = 30;
  const total = subTotal + taxes;

  // Load PayPal SDK script dynamically
  useEffect(() => {
    if (window.paypal) {
      renderPaypalButtons();
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AXSL2tgxFFVAau6FH-aiVbHg0tqpHis5YogjqiCkE9gZABoITJrXShPSVtTyhmumZhXl82kh4AIgvxMY&currency=USD";
    script.addEventListener("load", renderPaypalButtons);
    document.body.appendChild(script);

    return () => {
      if (script) script.removeEventListener("load", renderPaypalButtons);
    };
  }, []);

  function renderPaypalButtons() {
    if (!window.paypal || !paypalRef.current) return;

    // Clean any existing buttons to avoid duplicates when re-renders happen
    paypalRef.current.innerHTML = "";

    window.paypal
      .Buttons({
        style: {
          color: "blue",
          shape: "rect",
          label: "pay",
          tagline: false,
          height: 40,
        },

        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                description: "RentHub Order",
                amount: {
                  currency_code: "USD",
                  value: (total / 80).toFixed(2), // Convert INR to approx USD for demo
                },
              },
            ],
            application_context: {
              shipping_preference: "NO_SHIPPING",
            },
          });
        },

        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            setPaymentStatus(`Transaction completed by ${details.payer.name.given_name}`);
            alert(`Transaction completed by ${details.payer.name.given_name}`);
          });
        },

        onError: function (err) {
          setPaymentStatus(`Payment failed: ${err.toString()}`);
          alert(`Payment failed: ${err.toString()}`);
        },
      })
      .render(paypalRef.current);
  }

  function handleApplyCoupon() {
    if (coupon.trim().toUpperCase() === "RENT10") setCouponApplied(true);
    else setCouponApplied(false);
  }

  return React.createElement(
    "div",
    {
      className:
        "min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100",
    },
    React.createElement(Navbar, { cartCount: 2 }),
    React.createElement(
      "div",
      { className: "max-w-lg mx-auto px-4 py-8" },

      // Breadcrumb
      React.createElement(
        "div",
        { className: "text-xs text-gray-500 mb-5 flex items-center gap-2" },
        "Review Order",
        React.createElement(ChevronRight, { size: 16 }),
        "Delivery",
        React.createElement(ChevronRight, { size: 16 }),
        React.createElement(
          "span",
          { className: "text-purple-700 font-semibold" },
          "Payment"
        )
      ),

      // Order Summary Panel
      React.createElement(
        "div",
        {
          className:
            "bg-white rounded-xl shadow-xl border border-gray-200 p-6 mb-6",
        },
        React.createElement(
          "h3",
          {
            className:
              "text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2",
          },
          "Order Summary ",
          React.createElement(FileText, {
            size: 20,
            className: "text-purple-500",
          })
        ),
        orderItems.map((itm, idx) =>
          React.createElement(
            "div",
            {
              key: idx,
              className: "flex justify-between text-sm text-gray-700 mb-1",
            },
            React.createElement("span", null, itm.name),
            React.createElement("span", null, `₹${itm.price}`)
          )
        ),
        React.createElement(
          "div",
          { className: "flex justify-between text-sm text-gray-700" },
          React.createElement("span", null, "Taxes"),
          React.createElement("span", null, `₹${taxes}`)
        ),
        React.createElement(
          "div",
          {
            className: "flex justify-between font-bold text-lg text-blue-700 mt-2",
          },
          React.createElement("span", null, "Total"),
          React.createElement("span", null, `₹${total}`)
        ),

        // Coupon Input
        React.createElement(
          "div",
          { className: "mt-6 flex gap-2 items-center" },
          React.createElement(Ticket, { size: 20, className: "text-purple-600" }),
          React.createElement("input", {
            type: "text",
            value: coupon,
            placeholder: "Coupon Code",
            onChange: (e) => {
              setCouponApplied(false);
              setCoupon(e.target.value);
            },
            className:
              "flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-400",
          }),
          React.createElement(
            "button",
            {
              className:
                "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-sm",
              onClick: handleApplyCoupon,
            },
            "Apply"
          )
        ),

        couponApplied &&
          React.createElement(
            "div",
            { className: "text-green-700 text-xs mt-2" },
            "Coupon Applied: RENT10!"
          )
      ),

      // PayPal Buttons container
      React.createElement(
        "div",
        { ref: paypalRef, className: "min-h-[72px]" } // Reserve space for PayPal buttons
      ),

      // Payment Status message
      paymentStatus &&
        React.createElement(
          "div",
          {
            className:
              "mt-4 p-3 bg-green-100 text-green-800 rounded-lg font-semibold",
          },
          paymentStatus
        )
    )
  );
}

export function attachPaymentListeners() {
  console.log("Payment page loaded");
}
