"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Headphones, Laptop } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { Navbar } from "../../components/shop/Navbar";
import { Footer } from "../../components/shop/Footer";
import { ProductCard } from "../../components/shop/ProductCard";
import { CartDrawer } from "../../components/shop/CartDrawer";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { useCart } from "../../hooks/use-cart";

export default function HomePage() {
  const { items, isDrawerOpen, openCart, closeCart, addItem, updateQuantity, removeItem, totalCount } = useCart();

  // Fetch products from backend API
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["trending-products"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/products?limit=6");
      return res.data?.data || [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950">
      <Navbar onOpenCart={openCart} cartItemCount={totalCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl glass-card border border-slate-800 p-8 sm:p-12 lg:p-16">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Generation E-Commerce Experience</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight leading-tight">
              Elevate Your Everyday <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                With Curated Luxury.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
              Discover workstation laptops, beryllium noise-canceling headphones, and Italian wool blazers crafted for creators and leaders.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/products">
                <Button variant="primary" size="lg" className="shadow-indigo-500/25">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/products?category=electronics">
                <Button variant="outline" size="lg">
                  <span>Shop Electronics</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Featured Categories</h2>
              <p className="text-xs text-slate-400">Browse engineered hardware & tailored apparel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/products?category=electronics" className="group">
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between">
                <div className="space-y-2">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    Electronics & Gadgets
                  </h3>
                  <p className="text-xs text-slate-400">Laptops, wireless audio & smart wearables</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link href="/products?category=fashion-apparel" className="group">
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between">
                <div className="space-y-2">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    Fashion & Apparel
                  </h3>
                  <p className="text-xs text-slate-400">Tailored blazers, luxury footwear & outerwear</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </section>

        {/* Trending Products Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Trending Products</h2>
              <p className="text-xs text-slate-400">Handpicked items available for express delivery</p>
            </div>
            <Link href="/products" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View All &rarr;
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
                  imageUrl={prod.images?.[0]?.url || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600"}
                  categoryName="Electronics"
                  isFeatured={prod.isFeatured}
                  onAddToCart={() =>
                    addItem({
                      id: prod.id,
                      title: prod.title,
                      price: prod.basePrice,
                      quantity: 1,
                      imageUrl: prod.images?.[0]?.url || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
                    })
                  }
                />
              ))
            ) : (
              <p className="col-span-full text-center text-slate-400 text-sm py-8">No trending products available.</p>
            )}
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
