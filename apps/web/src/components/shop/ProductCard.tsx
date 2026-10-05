"use client";

import React from "react";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  imageUrl?: string;
  categoryName?: string;
  rating?: number;
  isFeatured?: boolean;
  onAddToCart?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  slug,
  basePrice,
  imageUrl,
  categoryName = "Electronics",
  rating = 4.8,
  isFeatured = false,
  onAddToCart,
}) => {
  return (
    <Card className="group flex flex-col justify-between h-full p-4 glass-card border border-slate-800 hover:border-indigo-500/40 transition-all duration-300">
      <div className="space-y-3">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-800 group-hover:border-slate-700 transition-colors">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600 font-semibold text-xs">
              No Image
            </div>
          )}

          {isFeatured && (
            <div className="absolute top-2.5 left-2.5">
              <Badge variant="primary">Featured</Badge>
            </div>
          )}

          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
            <Link href={`/products/${slug}`}>
              <Button variant="secondary" size="sm" className="rounded-full p-2.5">
                <Eye className="w-4 h-4 text-slate-200" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
            {categoryName}
          </span>
          <Link href={`/products/${slug}`} className="block mt-1">
            <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Footer Price & Cart CTA */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400">Price</span>
          <p className="text-base font-bold text-slate-100">${basePrice.toFixed(2)}</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onAddToCart && onAddToCart(id)}
          className="rounded-lg px-3 py-1.5"
        >
          <ShoppingCart className="w-4 h-4 mr-1.5" />
          <span>Add</span>
        </Button>
      </div>
    </Card>
  );
};
