"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "../../../../components/shop/Navbar";
import { Footer } from "../../../../components/shop/Footer";
import { Button } from "../../../../components/ui/Button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get("orderNumber") || "ORD-982134";

  return (
    <div className="glass-card p-8 rounded-3xl border border-slate-800 text-center space-y-6 shadow-2xl w-full">
      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full mx-auto flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-100">Order Placed Successfully!</h1>
        <p className="text-xs text-slate-400">
          Thank you for shopping with Luxe Store. A receipt has been sent to your email.
        </p>
      </div>

      <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1">
        <span className="text-slate-500 uppercase tracking-wider font-semibold">Order Reference</span>
        <p className="text-base font-bold text-indigo-400">{orderNumber}</p>
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <Link href="/products">
          <Button variant="primary" size="lg" className="w-full justify-center">
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950">
      <Navbar />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 my-16 flex items-center justify-center">
        <Suspense fallback={<div className="text-center text-slate-400">Loading order summary...</div>}>
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
