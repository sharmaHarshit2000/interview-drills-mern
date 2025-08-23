import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, History, Home, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const isActive = (p: string) =>
    location.pathname === p
      ? "text-primary-600 bg-primary-50"
      : "text-gray-600 hover:text-gray-900";

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/dashboard"
            className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Interview Drills
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(
                "/dashboard"
              )}`}
            >
              <Home className="w-4 h-4 mr-1" />
              Dashboard
            </Link>
            <Link
              to="/history"
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(
                "/history"
              )}`}
            >
              <History className="w-4 h-4 mr-1" />
              History
            </Link>

            <div className="flex items-center gap-2 pl-3 ml-2 border-l">
              {user?.picture && (
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm text-gray-700 max-w-[140px] truncate">
                {user?.name || user?.email}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white shadow-sm">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(
                "/dashboard"
              )}`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/history"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(
                "/history"
              )}`}
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Link>

            <div className="flex items-center gap-2 border-t pt-3">
              {user?.picture && (
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm text-gray-700 truncate">
                {user?.name || user?.email}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 transition-colors w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
