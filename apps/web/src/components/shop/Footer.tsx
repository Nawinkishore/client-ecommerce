import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full glass-panel border-t border-slate-800/80 mt-20 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-4 glass-card p-4 rounded-xl">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">Express Delivery</h4>
              <p className="text-xs text-slate-400">Fast worldwide shipping with tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-4 glass-card p-4 rounded-xl">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">Secure Payments</h4>
              <p className="text-xs text-slate-400">256-bit Stripe encrypted checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-4 glass-card p-4 rounded-xl">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">30-Day Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free money-back guarantee</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-slate-100">LUXE STORE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated premium catalog featuring state-of-the-art computing, audio, and designer fashion.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-xs">Categories</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products?category=electronics" className="hover:text-indigo-400">Electronics</Link></li>
              <li><Link href="/products?category=fashion-apparel" className="hover:text-indigo-400">Fashion & Apparel</Link></li>
              <li><Link href="/products" className="hover:text-indigo-400">Featured Products</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-xs">Account</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-indigo-400">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-indigo-400">Create Account</Link></li>
              <li><Link href="/account/orders" className="hover:text-indigo-400">Order History</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-200 mb-3 uppercase tracking-wider text-xs">Support</h5>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-indigo-400 cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-indigo-400 cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Luxe E-Commerce Monorepo. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
