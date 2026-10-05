"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf,
  Droplets,
  Truck,
  Award,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { Navbar } from "../../components/shop/Navbar";
import { Footer } from "../../components/shop/Footer";
import { ProductCard } from "../../components/shop/ProductCard";
import { CartDrawer } from "../../components/shop/CartDrawer";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { useCart } from "../../hooks/use-cart";
import { useAuth } from "../../hooks/use-auth";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { items, isDrawerOpen, openCart, closeCart, addItem, updateQuantity, removeItem, totalCount } = useCart();

  // Fetch products from backend API
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["sreesoap-products"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/products?limit=6");
      return res.data?.data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300">
      <Navbar onOpenCart={openCart} cartItemCount={totalCount} />

      {/* Logged-In User Banner Redirect Notice */}
      {isAuthenticated && (
        <div className="bg-emerald-600/10 border-b border-emerald-500/20 px-4 py-3 text-center">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Welcome back, <strong>{user?.fullName || user?.email}</strong>! You are currently signed in.
            </span>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-sm"
            >
              <span>Go to Shopping Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20">
        {/* Sreesoap Hero Section */}
        <section className="relative overflow-hidden rounded-3xl glass-card border border-slate-200 dark:border-slate-800 p-8 sm:p-12 lg:p-16">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>100% Organic & Handcrafted Botanical Skincare</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Nurture Your Skin With <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
                Sreesoap Pure Botanicals.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Experience cold-processed artisanal soaps handcrafted with virgin coconut oil, neem, tea tree, and natural essential oils designed for glowing, healthy skin.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/products">
                <Button variant="primary" size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25">
                  <span>Explore Soap Collection</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#efficiency">
                <Button variant="outline" size="lg" className="border-slate-300 dark:border-slate-700">
                  <span>How We Deliver Efficiently</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Company Efficiency & Process Section */}
        <section id="efficiency" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>THE SREESOAP GUARANTEE</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              How Sreesoap Provides Products Efficiently
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              From sustainable organic farming to cold-chain direct dispatch, our 4-pillar efficiency model ensures fresh, premium quality soaps at zero waste cost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">1. Organic Sourcing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct partnerships with ethical bio-certified farms ensure 100% pure cold-pressed oils & herbs.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="p-3.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl w-fit">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">2. Cold-Process Batching</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Slow-cured 4-week cold processing preserves natural glycerin without chemical heat degradation.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">3. Zero-Waste Packaging</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Biodegradable plant-cellulose wrappers eliminate single-use plastics completely.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="p-3.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl w-fit">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">4. Direct Express Shipping</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated fulfillment hubs ship fresh batches directly to your doorstep within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Sreesoap Products Grid */}
        <section id="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Featured Sreesoap Products</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Artisanal soaps crafted for nourishing facial & body care</p>
            </div>
            <Link href="/products" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              View All Soap Products &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="glass-card p-4 rounded-xl space-y-3">
                  <Skeleton className="w-full aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : productsData?.length > 0 ? (
              productsData.map((prod: any) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  title={prod.title}
                  slug={prod.slug}
                  basePrice={prod.basePrice}
                  imageUrl={prod.images?.[0]?.url || "https://images.unsplash.com/photo-1607006482602-76ca0fd2f88d?w=600"}
                  categoryName="Organic Soaps"
                  isFeatured={prod.isFeatured}
                  onAddToCart={() =>
                    addItem({
                      id: prod.id,
                      title: prod.title,
                      price: prod.basePrice,
                      quantity: 1,
                      imageUrl: prod.images?.[0]?.url || "https://images.unsplash.com/photo-1607006482602-76ca0fd2f88d?w=600",
                    })
                  }
                />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-400 text-sm py-8">No Sreesoap products available.</p>
            )}
          </div>
        </section>

        {/* About Sreesoap Section */}
        <section id="about" className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">About Sreesoap</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Pure Ingredients. Sustainable Care.</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Founded on the belief that everyday bathing should be a restorative ritual, Sreesoap formulates nutrient-rich bars free from synthetic parabens, sulfates, and artificial dyes.
            </p>
            <div className="pt-2">
              <Link href="/products">
                <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  <span>Start Shopping</span>
                  <ShoppingBag className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-80 aspect-square rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-6 text-center">
            <div className="space-y-2">
              <Leaf className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-900 dark:text-slate-100">100% Chemical-Free</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cold-pressed plant extracts & pure essential oils.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
}
