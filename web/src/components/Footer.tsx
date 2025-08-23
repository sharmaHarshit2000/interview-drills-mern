import { Link } from "react-router-dom";
import {  LayoutDashboard, History, LogIn } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">My App</span>. All rights
          reserved.
        </p>

        <div className="flex space-x-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 hover:text-white transition duration-200"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link
            to="/history"
            className="flex items-center gap-1 hover:text-white transition duration-200"
          >
            <History size={18} /> History
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1 hover:text-white transition duration-200"
          >
            <LogIn size={18} /> Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
