"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, LogOut, Sun, Moon, Menu, X, Sparkles, User, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/use-auth";
import { useTheme } from "../../context/theme-context";

export interface NavbarProps {
  onOpenCart?: () => void;
  cartItemCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, cartItemCount = 0 }) => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 w-full glass-panel transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo - Sreesoap */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent">
              Sreesoap
            </span>
            <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase -mt-1">
              Organic Skincare
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <Link href="/products" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Products
          </Link>
          <Link href="/#efficiency" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            Efficiency & Process
          </Link>
          <Link href="/#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            About Sreesoap
          </Link>
          {role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Sreesoap products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full glass-input"
          />
        </div>

        {/* Actions (Theme Toggle, Cart, Dynamic Auth) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button (Light / Dark Mode Only) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors border border-slate-200 dark:border-slate-800"
            aria-label="Toggle Theme"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Cart Icon */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCart}
            className="relative p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/80"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold text-white bg-emerald-600 rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
                {cartItemCount}
              </span>
            )}
          </Button>

          {/* Dynamic Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>{user?.fullName || user?.email.split("@")[0]}</span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="inline-flex items-center gap-1.5 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600"
          >
            Products
          </Link>
          <Link
            href="/#efficiency"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600"
          >
            Efficiency & Process
          </Link>
          <Link
            href="/#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600"
          >
            About Sreesoap
          </Link>
          {!isAuthenticated ? (
            <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                <Button variant="primary" size="sm" className="w-full bg-emerald-600">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-semibold text-emerald-600 dark:text-emerald-400"
              >
                My Account Profile
              </Link>
              <Button variant="outline" size="sm" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-rose-500 border-rose-500/30">
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
