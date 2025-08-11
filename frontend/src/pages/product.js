import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  ShoppingCart,
  Package,
  BarChart3,
  FileText,
  User,
  Camera,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

// --- Navbar with "Products" highlighted ---
const navigationTabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, isActive: false },
  { id: "rental", label: "Rental", icon: ShoppingCart },
  { id: "order", label: "Order", icon: Package },
  { id: "products", label: "Products", icon: Package, isActive: true }, // <-- Products highlighted
  { id: "reporting", label: "Reporting", icon: FileText },
];

function Navbar() {
  return React.createElement(
    "header",
    { className: "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border-b border-gray-200 px-6 py-4" },
    React.createElement(
      "div",
      { className: "flex items-center justify-between" },
      React.createElement(
        "div",
        { className: "flex items-center gap-8" },
        React.createElement(
          "div",
          { className: "flex items-center gap-3" },
          React.createElement(
            "div",
            { className: "w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" },
            React.createElement(Zap, { size: 24, className: "text-white" })
          ),
          React.createElement("h1", { className: "text-xl font-extrabold text-purple-700" }, "RentHub")
        ),
        React.createElement(
          "nav",
          { className: "flex items-center gap-1" },
          navigationTabs.map(tab =>
            React.createElement(
              "button",
              {
                key: tab.id,
                className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab.isActive
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
                }`,
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
            className: "w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600 text-white",
            whileHover: { scale: 1.1 },
          },
          React.createElement(User, { size: 20 })
        ),
        React.createElement("span", { className: "hidden sm:block font-medium text-gray-700" }, "Adam")
      )
    )
  );
}

// --- Product Editor Card ---
function ProductCard({
  product,
  onEdit,
  onDelete,
  onImageChange,
  onPriceChange,
  onInfoChange,
  onStockChange,
  onChargesChange,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editImg, setEditImg] = useState(product.image || "");
  const [editPrice, setEditPrice] = useState(product.price);
  const [editInfo, setEditInfo] = useState(product.generalInfo);
  const [editStock, setEditStock] = useState(product.stock);
  const [editCharges, setEditCharges] = useState(product.extraCharges);

  function handleSave() {
    setIsEditing(false);
    onEdit(product.id, {
      image: editImg,
      price: editPrice,
      generalInfo: editInfo,
      stock: editStock,
      extraCharges: editCharges
    });
  }

  function handleChargeChange(idx, field, value) {
    setEditCharges(arr =>
      arr.map((c, i) => i === idx ? { ...c, [field]: value } : c)
    );
    onChargesChange(product.id, editCharges);
  }

  return React.createElement(
    "div",
    {
      className:
        "bg-white/95 rounded-xl border border-purple-200 shadow-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center",
    },
    // --- Left: image & upload ---
    React.createElement(
      "div",
      { className: "flex flex-col items-center" },
      React.createElement(
        "div",
        { className: "relative mb-4 w-40 h-40 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden" },
        product.image ? React.createElement("img", { src: product.image, alt: product.name, className: "w-full h-full object-cover" }) :
          React.createElement(Camera, { size: 48, className: "text-gray-400" }),
        isEditing &&
          React.createElement(
            "input",
            {
              type: "file",
              accept: "image/*",
              className: "absolute inset-0 opacity-0 cursor-pointer",
              onChange: e => {
                if (e.target.files && e.target.files[0]) {
                  const url = URL.createObjectURL(e.target.files[0]);
                  setEditImg(url);
                  onImageChange(product.id, url);
                }
              }
            }
          ),
        isEditing &&
          React.createElement(
            "span",
            { className: "absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs" }, "Change"
          )
      ),
      React.createElement(
        "div",
        { className: "mt-2 text-gray-700 text-sm" },
        "Stock:",
        isEditing
          ? React.createElement("input", {
              type: "number",
              value: editStock,
              min: 0,
              onChange: e => {
                setEditStock(Number(e.target.value));
                onStockChange(product.id, Number(e.target.value));
              },
              className: "ml-2 border px-2 py-1 rounded w-20"
            })
          : React.createElement("span", { className: "ml-2 font-bold" }, product.stock)
      )
    ),
    // --- Right: main info, price, charges, actions
    React.createElement(
      "div",
      null,
      isEditing
        ? React.createElement("input", {
            value: editInfo,
            onChange: e => setEditInfo(e.target.value),
            className: "mb-3 w-full px-3 py-2 border rounded-lg text-base font-semibold text-purple-700"
          })
        : React.createElement("h2", { className: "text-lg font-bold text-purple-700 mb-3" }, product.generalInfo),

      React.createElement(
        "div",
        { className: "mb-2 text-gray-700" },
        "Rental Period: ",
        React.createElement("span", { className: "font-semibold" }, product.rentalPeriods.map(p => p.period).join(", "))
      ),
      React.createElement(
        "div",
        { className: "mb-2 text-blue-700 font-bold flex items-center gap-2" },
        isEditing
          ? React.createElement("input", {
              type: "number",
              value: editPrice,
              onChange: e => {
                setEditPrice(Number(e.target.value));
                onPriceChange(product.id, Number(e.target.value));
              },
              className: "w-28 px-3 py-2 border rounded-lg text-lg font-bold text-blue-700"
            })
          : `₹${product.price}`
      ),
      React.createElement(
        "div",
        { className: "mb-2" },
        React.createElement("span", { className: "font-semibold text-gray-900" }, "Extra Rental Reservation Charges:"),
        React.createElement(
          "table",
          { className: "w-full text-sm mt-2" },
          React.createElement(
            "tbody",
            null,
            editCharges.map((charge, idx) =>
              React.createElement(
                "tr",
                { key: idx },
                React.createElement("td", { className: "py-1 pr-3 text-gray-600" }, charge.type),
                React.createElement("td", null,
                  isEditing
                    ? React.createElement("input", {
                        type: "number",
                        value: charge.price,
                        min: 0,
                        onChange: e => handleChargeChange(idx, "price", Number(e.target.value)),
                        className: "w-20 px-2 py-1 border rounded"
                      })
                    : React.createElement("span", { className: "text-blue-700 font-semibold" }, `₹${charge.price}`)
                )
              )
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "flex gap-4 mt-4" },
        isEditing
          ? React.createElement(
              motion.button,
              {
                onClick: handleSave,
                className: "bg-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow hover:bg-blue-700",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.96 }
              },
              "Save"
            )
          : React.createElement(
              motion.button,
              {
                onClick: () => setIsEditing(true),
                className: "bg-purple-600 text-white px-5 py-2 rounded-lg font-medium shadow hover:bg-purple-700 flex items-center gap-2",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.96 }
              },
              React.createElement(Pencil, { size: 18 }),
              "Edit"
            ),
        React.createElement(
          motion.button,
          {
            onClick: () => onDelete(product.id),
            className: "bg-red-100 text-red-600 px-3 py-2 rounded-lg font-medium hover:bg-red-200 ml-2 flex items-center gap-2",
            whileHover: { scale: 1.05 },
          },
          React.createElement(Trash2, { size: 18 }),
          "Delete"
        )
      )
    )
  );
}

function getDefaultProducts() {
  return [
    {
      id: 1,
      name: "Professional Camera Kit",
      image: "",
      price: 1200,
      stock: 7,
      generalInfo: "High-quality camera kit for rental. Advanced features, ideal for shoots.",
      rentalPeriods: [
        { period: "1 Day", pricelist: "Basic", price: 500 },
        { period: "1 Week", pricelist: "Premium", price: 2400 }
      ],
      extraCharges: [
        { type: "Extra Hour", price: 150 },
        { type: "Extra Day", price: 400 }
      ]
    },
    {
      id: 2,
      name: "GoPro Action Camera",
      image: "",
      price: 800,
      stock: 16,
      generalInfo: "Compact waterproof camera for adventure shoots and travel.",
      rentalPeriods: [
        { period: "1 Day", pricelist: "Standard", price: 300 },
        { period: "1 Week", pricelist: "Standard", price: 1400 }
      ],
      extraCharges: [
        { type: "Extra Hour", price: 80 },
        { type: "Extra Day", price: 220 }
      ]
    }
  ];
}

export default function ProductPage() {
  const [products, setProducts] = useState(getDefaultProducts());
  const [cartCount, setCartCount] = useState(2);

  function handleEdit(id, updates) {
    setProducts(products =>
      products.map(prod =>
        prod.id === id ? { ...prod, ...updates } : prod
      )
    );
  }
  function handleDelete(id) {
    setProducts(products => products.filter(p => p.id !== id));
  }
  function handleImageChange(id, url) {
    setProducts(products =>
      products.map(prod =>
        prod.id === id ? { ...prod, image: url } : prod
      )
    );
  }
  function handlePriceChange(id, price) {
    setProducts(products =>
      products.map(prod =>
        prod.id === id ? { ...prod, price } : prod
      )
    );
  }
  function handleInfoChange(id, info) {
    setProducts(products =>
      products.map(prod =>
        prod.id === id ? { ...prod, generalInfo: info } : prod
      )
    );
  }
  function handleStockChange(id, stock) {
    setProducts(products =>
      products.map(prod =>
        prod.id === id ? { ...prod, stock } : prod
      )
    );
  }
  function handleChargesChange(id, extraCharges) {
    setProducts(products =>
      products.map(prod =>
        prod.id === id ? { ...prod, extraCharges } : prod
      )
    );
  }

  function handleAddProduct() {
    setProducts(prods =>
      [
        ...prods,
        {
          id: Date.now(),
          name: "New Product",
          image: "",
          price: 100,
          stock: 0,
          generalInfo: "",
          rentalPeriods: [],
          extraCharges: [{ type: "Extra Hour", price: 0 }, { type: "Extra Day", price: 0 }]
        }
      ]
    );
  }

  return React.createElement(
    "div",
    { className: "min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100" },
    React.createElement(Navbar, { cartCount }),
    React.createElement(
      "div",
      { className: "max-w-6xl mx-auto px-4 py-8" },
      React.createElement(
        "div",
        { className: "mb-8 flex items-center justify-between" },
        React.createElement("h1", { className: "text-xl font-bold text-purple-700" }, "Product Manager"),
        React.createElement(
          motion.button,
          {
            onClick: handleAddProduct,
            className: "bg-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow hover:bg-blue-700 flex items-center gap-2",
            whileHover: { scale: 1.05 },
          },
          React.createElement(Plus, { size: 18 }),
          "Add Product"
        )
      ),
      products.map(product =>
        React.createElement(ProductCard, {
          key: product.id,
          product,
          onEdit: handleEdit,
          onDelete: handleDelete,
          onImageChange: handleImageChange,
          onPriceChange: handlePriceChange,
          onInfoChange: handleInfoChange,
          onStockChange: handleStockChange,
          onChargesChange: handleChargesChange
        })
      )
    )
  );
}

export function attachProductListeners() {
  console.log("Product page loaded");
}
