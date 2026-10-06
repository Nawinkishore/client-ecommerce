"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Star, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { apiClient } from "../../../../lib/api-client";
import { Navbar } from "../../../../components/shop/Navbar";
import { Footer } from "../../../../components/shop/Footer";
import { ImageGallery } from "../../../../components/shop/ImageGallery";
import { VariantSelector, Variant } from "../../../../components/shop/VariantSelector";
import { CartDrawer } from "../../../../components/shop/CartDrawer";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { Skeleton } from "../../../../components/ui/Skeleton";
import { useCart } from "../../../../hooks/use-cart";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { items, isDrawerOpen, openCart, closeCart, addItem, updateQuantity, removeItem, totalCount } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product-detail", slug],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/products/${slug}`);
      return res.data?.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar onOpenCart={openCart} cartItemCount={totalCount} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-950">
        <Navbar onOpenCart={openCart} cartItemCount={totalCount} />
        <div className="max-w-md mx-auto my-20 p-8 glass-card rounded-2xl text-center space-y-4 border border-slate-800">
          <h2 className="text-xl font-bold text-slate-100">Product Not Found</h2>
          <p className="text-xs text-slate-400">The requested product could not be located in our catalog.</p>
          <Link href="/products">
            <Button variant="primary" size="sm">
              Back to Catalog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.basePrice;
  const sampleImages = product.images?.length > 0
    ? product.images
    : [{ url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600" }];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: `${product.title}${selectedVariant ? ` (${Object.values(selectedVariant.attributes || {}).join(", ")})` : ""}`,
      price: currentPrice,
      quantity,
      imageUrl: sampleImages[0]?.url,
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950">
      <Navbar onOpenCart={openCart} cartItemCount={totalCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <Link href="/products" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Gallery */}
          <ImageGallery images={sampleImages} />

          {/* Specs & Buy Box */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge variant="primary">In Stock</Badge>
              <h1 className="text-3xl font-extrabold text-slate-100">{product.title}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 font-bold text-slate-200">{product.averageRating || "4.9"}</span>
                </div>
                <span>&bull;</span>
                <span>{product.reviewCount || 12} Verified Reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-extrabold text-indigo-400">
              ${Number(currentPrice || 0).toFixed(2)}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <VariantSelector
                variants={product.variants}
                selectedVariantId={selectedVariant?.id}
                onSelectVariant={(v) => setSelectedVariant(v)}
              />
            )}

            {/* Quantity & CTA */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center border border-slate-700 rounded-lg bg-slate-900 px-3 py-2 text-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-400 hover:text-white px-2"
                >
                  -
                </button>
                <span className="px-3 font-semibold text-slate-100">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-slate-400 hover:text-white px-2">
                  +
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 justify-center shadow-indigo-500/25"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                <span>Add to Cart</span>
              </Button>
            </div>

            {/* Shipping & Security Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-400" />
                <span>Express 2-Day Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Stripe Encrypted Payment</span>
              </div>
            </div>
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
