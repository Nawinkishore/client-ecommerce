"use client";

import React from "react";
import Link from "next/link";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variantInfo?: string;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (id: string, newQty: number) => void;
  onRemoveItem?: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-700/60 shadow-2xl flex flex-col justify-between p-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-100 font-bold text-lg">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <span>Your Cart ({items.length})</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="p-4 bg-slate-800/40 text-slate-500 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-slate-400 text-sm">Your cart is currently empty.</p>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 glass-card p-3.5 rounded-xl border border-slate-800"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg bg-slate-800"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-100 truncate">{item.title}</h4>
                      {item.variantInfo && <p className="text-xs text-slate-400">{item.variantInfo}</p>}
                      <p className="text-xs font-bold text-indigo-400 mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveItem && onRemoveItem(item.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center border border-slate-700 rounded-md bg-slate-900/60 text-xs">
                        <button
                          onClick={() =>
                            onUpdateQuantity && onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 font-medium text-slate-200">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-slate-200 font-medium">
                <span>Subtotal</span>
                <span className="text-lg font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400">Shipping and taxes calculated at checkout.</p>
              <Link href="/checkout" onClick={onClose} className="block">
                <Button variant="primary" size="lg" className="w-full justify-between">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
