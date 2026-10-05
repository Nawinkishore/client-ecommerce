"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../lib/api-client";
import { Navbar } from "../../../components/shop/Navbar";
import { Footer } from "../../../components/shop/Footer";
import { ProductCard } from "../../../components/shop/ProductCard";
import { ProductFilterSidebar, FilterOptions } from "../../../components/shop/ProductFilterSidebar";
import { CartDrawer } from "../../../components/shop/CartDrawer";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useCart } from "../../../hooks/use-cart";

export default function CatalogPage() {
  const { items, isDrawerOpen, openCart, closeCart, addItem, updateQuantity, removeItem, totalCount } = useCart();
  const [filters, setFilters] = useState<FilterOptions>({ category: "", sortBy: "newest" });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["catalog-products", filters],
    queryFn: async () => {
      let url = "/api/v1/products?limit=20";
      if (filters.category) url += `&category=${filters.category}`;
      const res = await apiClient.get(url);
      return res.data?.data || [];
    },
  });

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({ category: "", sortBy: "newest" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950">
      <Navbar onOpenCart={openCart} cartItemCount={totalCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Product Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse our full range of workstation computers, wireless audio, and designer apparel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <ProductFilterSidebar
              currentFilters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="glass-card p-4 rounded-xl space-y-3">
                    <Skeleton className="w-full aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : productsData?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData.map((prod: any) => (
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
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center space-y-3 rounded-2xl border border-slate-800">
                <p className="text-slate-300 font-semibold">No products found</p>
                <p className="text-xs text-slate-500">Try adjusting your category or filter selections.</p>
              </div>
            )}
          </div>
        </div>
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
