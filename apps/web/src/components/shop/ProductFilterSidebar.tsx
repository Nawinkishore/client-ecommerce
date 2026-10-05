"use client";

import React from "react";
import { Filter, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export interface ProductFilterSidebarProps {
  currentFilters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  currentFilters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</h4>
        <div className="space-y-1">
          {[
            { label: "All Categories", value: "" },
            { label: "Electronics", value: "electronics" },
            { label: "Fashion & Apparel", value: "fashion-apparel" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => onFilterChange({ category: cat.value })}
              className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                (currentFilters.category || "") === cat.value
                  ? "bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30"
                  : "text-slate-300 hover:bg-slate-800/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Option */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sort By</h4>
        <select
          value={currentFilters.sortBy || "newest"}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          className="w-full px-3 py-2 text-xs rounded-lg glass-input bg-slate-900 text-slate-200"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};
