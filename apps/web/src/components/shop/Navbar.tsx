"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export interface NavbarProps {
  onOpenCart?: () => void;
  cartItemCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, cartItemCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            LUXE STORE
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/products" className="hover:text-indigo-400 transition-colors">
            All Products
          </Link>
          <Link href="/products?category=electronics" className="hover:text-indigo-400 transition-colors">
            Electronics
          </Link>
          <Link href="/products?category=fashion-apparel" className="hover:text-indigo-400 transition-colors">
            Fashion
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full glass-input"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCart}
            className="relative p-2 rounded-full"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-slate-200" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold text-white bg-indigo-600 rounded-full border-2 border-slate-900 animate-pulse">
                {cartItemCount}
              </span>
            )}
          </Button>

          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 py-4 space-y-3">
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-indigo-400"
          >
            All Products
          </Link>
          <Link
            href="/products?category=electronics"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-indigo-400"
          >
            Electronics
          </Link>
          <Link
            href="/products?category=fashion-apparel"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 hover:text-indigo-400"
          >
            Fashion
          </Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="primary" size="sm" className="w-full mt-2">
              Sign In
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};
