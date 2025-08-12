import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  Home,
  Phone,
  ShoppingCart,
  Store,
  ChevronDown,
  LogOut,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { totalCartQty, getWishlist } from "@/lib/utils";

type APICategory = { _id: string; name: string };

export default function CustomerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const userJson =
    typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;
  const user = userJson ? JSON.parse(userJson) : null;

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cartCount, setCartCount] = useState<number>(totalCartQty());
  const [wishlistCount, setWishlistCount] = useState<number>(getWishlist().length);
  const [categories, setCategories] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const activePath = location.pathname;

  useEffect(() => {
    const onCart = () => setCartCount(totalCartQty());
    const onWish = () => setWishlistCount(getWishlist().length);
    window.addEventListener("cart:updated", onCart);
    window.addEventListener("wishlist:updated", onWish);
    return () => {
      window.removeEventListener("cart:updated", onCart);
      window.removeEventListener("wishlist:updated", onWish);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/v1/category/all-categories");
        const names = (res.data?.data ?? []).map((c: APICategory) => c.name);
        setCategories(names);
      } catch {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 1);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur transition-shadow ${
        scrolled ? "shadow-md bg-white/90" : "shadow-sm bg-white/80"
      }`}
    >
      {/* Main navbar row */}
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo + nav links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600 text-white"
            >
              <Zap size={22} />
            </motion.div>
            <span className="font-extrabold text-lg text-purple-700">
              RentalHub
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm ml-6">
            <NavButton
              onClick={() => navigate("/dashboard/customer")}
              active={activePath === "/dashboard/customer"}
            >
              <Home size={16} /> Home
            </NavButton>
            <NavButton
              onClick={() => navigate("/dashboard/customer/shop")}
              active={activePath.includes("/dashboard/customer/shop")}
            >
              <Store size={16} /> Rental Shop
            </NavButton>
            <NavButton
              onClick={() => navigate("/wishlist")}
              active={activePath === "/wishlist"}
            >
              <Heart size={16} /> Wishlist ({wishlistCount})
            </NavButton>
            <NavButton
              onClick={() => navigate("/cart")}
              active={activePath === "/cart"}
            >
              <ShoppingCart size={16} /> Cart ({cartCount})
            </NavButton>
            <NavButton
              onClick={() => navigate("/dashboard/customer#contact")}
            >
              <Phone size={16} /> Contact Us
            </NavButton>
          </nav>
        </div>

        {/* Right: Profile */}
        <div className="relative">
          <motion.button
            onClick={() => setShowProfileMenu((s) => !s)}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white hover:bg-purple-50 text-sm font-medium"
          >
            <span>{user?.name ?? "Profile"}</span>
            <ChevronDown
              className={`size-4 transition-transform ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </motion.button>
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-sm p-1 text-sm z-50"
              >
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-purple-50"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-purple-50 text-red-600"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categories strip */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t bg-white/70"
      >
        {categories.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
            <span className="text-sm text-gray-500 mr-1">Categories:</span>
            {categories.map((c) => (
              <motion.button
                key={c}
                onClick={() => navigate("/dashboard/customer/shop")}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-purple-50 whitespace-nowrap"
              >
                {c}
              </motion.button>
            ))}
            <button
              onClick={() => navigate("/dashboard/customer/shop")}
              className="ml-auto text-xs text-gray-500 hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </motion.div>
    </header>
  );
}

function NavButton({
  onClick,
  children,
  active,
}: {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-4 py-2 rounded-md font-medium transition-colors ${
        active
          ? "bg-purple-600 text-white shadow-md"
          : "text-gray-700 hover:bg-purple-100"
      }`}
    >
      {children}
    </motion.button>
  );
}
