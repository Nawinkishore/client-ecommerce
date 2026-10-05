"use client";

import React from "react";

export interface Variant {
  id: string;
  sku: string;
  price: number;
  stockCount: number;
  attributes: Record<string, string>;
}

export interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId?: string;
  onSelectVariant: (variant: Variant) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariantId,
  onSelectVariant,
}) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Select Configuration
      </h4>
      <div className="grid grid-cols-2 gap-2.5">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isOutOfStock = variant.stockCount <= 0;
          const attrSummary = Object.entries(variant.attributes || {})
            .map(([k, v]) => `${k}: ${v}`)
            .join(" / ") || variant.sku;

          return (
            <button
              key={variant.id}
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(variant)}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                isSelected
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold"
                  : isOutOfStock
                  ? "border-slate-800 opacity-40 cursor-not-allowed text-slate-500"
                  : "border-slate-800 hover:border-slate-700 text-slate-300 glass-card"
              }`}
            >
              <div className="font-semibold">{attrSummary}</div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-indigo-400 font-bold">${variant.price.toFixed(2)}</span>
                <span className={isOutOfStock ? "text-red-400" : "text-emerald-400"}>
                  {isOutOfStock ? "Out of Stock" : `${variant.stockCount} in stock`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
