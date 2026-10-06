import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, Heart, ShoppingCart, User } from "lucide-react";

import Container from "../ui/Container";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-gray-200 bg-white/90 shadow-sm backdrop-blur-md"
            : "border-gray-100 bg-white"
        }`}
      >
        <Container>
          <div className="flex h-16 items-center justify-between gap-6">
            {/* LOGO */}
            <Logo />

            {/* DESKTOP NAVIGATION */}
            <div className="hidden lg:flex items-center gap-6">
              <NavLinks />
              {/* WANTED BOARD */}
              <Link
                to="/wanted"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Wanted Board
              </Link>

              {user?.role === "SELLER" && (
                <Link
                  to="/seller"
                  className="font-medium text-gray-700 transition hover:text-blue-600"
                >
                  Seller Dashboard
                </Link>
              )}
            </div>

            {/* DESKTOP ICONS */}
            <div className="hidden items-center gap-2 lg:flex">
              {/* SEARCH */}
              <Link
                to="/search"
                title="Search"
                aria-label="Search"
                className="group flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
              >
                <Search
                  size={20}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </Link>

              {/* WISHLIST */}
              <Link
                to="/wishlist"
                title="Wishlist"
                aria-label="Wishlist"
                className="group flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-red-50 hover:text-red-500"
              >
                <Heart
                  size={20}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </Link>

              {/* CART */}
              <Link
                to="/cart"
                title="Cart"
                aria-label="Cart"
                className="group flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
              >
                <ShoppingCart
                  size={20}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </Link>

              {/* PROFILE */}
              {user ? (
                <Link
                  to="/profile"
                  title={`${user.role || "User"} Profile`}
                  aria-label="Profile"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                >
                  <User size={19} strokeWidth={2} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  title="Login"
                  aria-label="Login"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <User size={19} strokeWidth={2} />
                </Link>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 lg:hidden"
            >
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </Container>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-b border-gray-200 bg-white shadow-md lg:hidden">
          <Container>
            <div className="space-y-2 py-4">
              <NavLinks />
               {/* WANTED BOARD */}
              <Link
                to="/wanted"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                Wanted Board
              </Link>
              
              {user?.role === "SELLER" && (
                <Link
                  to="/seller"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  Seller Dashboard
                </Link>
              )}

              <div className="my-3 border-t border-gray-100" />

              <div className="grid grid-cols-4 gap-2">
                <Link
                  to="/search"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-col items-center gap-1 rounded-xl p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Search size={20} />
                  <span className="text-xs">Search</span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-col items-center gap-1 rounded-xl p-3 text-gray-600 hover:bg-red-50 hover:text-red-500"
                >
                  <Heart size={20} />
                  <span className="text-xs">Wishlist</span>
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-col items-center gap-1 rounded-xl p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <ShoppingCart size={20} />
                  <span className="text-xs">Cart</span>
                </Link>

                <Link
                  to={user ? "/profile" : "/login"}
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-col items-center gap-1 rounded-xl p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <User size={20} />
                  <span className="text-xs">{user ? "Profile" : "Login"}</span>
                </Link>
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
};

export default Navbar;
