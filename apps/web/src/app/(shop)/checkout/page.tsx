"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { Navbar } from "../../../components/shop/Navbar";
import { Footer } from "../../../components/shop/Footer";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useCart } from "../../../hooks/use-cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, totalCount } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [address, setAddress] = useState({
    street: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
  });

  const shippingCost = 0.0;
  const total = subtotal + shippingCost;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate order placement
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      router.push("/checkout/success?orderNumber=ORD-" + Math.floor(100000 + Math.random() * 900000));
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950">
      <Navbar cartItemCount={totalCount} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Checkout</h1>
          <p className="text-xs text-slate-400 mt-1">Complete your order with 256-bit encrypted checkout.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-slate-100">Shipping Address</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
                <Input
                  label="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
                <Input
                  label="State / Province"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
                <Input
                  label="Postal Code"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                />
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-slate-100">Payment Information</h3>
              </div>

              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-600/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>Stripe Encrypted Payment</span>
                  </span>
                  <span>Test Card: 4242...</span>
                </div>
                <Input placeholder="Cardholder Name" defaultValue="Jane Doe" />
                <Input placeholder="Card Number (4242 4242 4242 4242)" defaultValue="4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" defaultValue="12/28" />
                  <Input placeholder="CVC" defaultValue="123" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6 sticky top-24">
              <h3 className="font-bold text-slate-100 pb-3 border-b border-slate-800">Order Summary</h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[160px]">
                      {item.quantity}x {item.title}
                    </span>
                    <span className="font-bold text-slate-100">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-200 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-100 pt-2 border-t border-slate-800">
                  <span>Total Due</span>
                  <span className="text-indigo-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitOrder}
                isLoading={isProcessing}
                className="w-full justify-center shadow-indigo-500/25"
              >
                <span>Place Order (${total.toFixed(2)})</span>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
