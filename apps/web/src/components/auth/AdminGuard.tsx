"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, Sparkles, ArrowRight, Home } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-200">Verifying Admin Credentials</p>
          <p className="text-xs text-slate-500">Checking security permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800 text-center space-y-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Access Restricted</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              You need an active <span className="text-amber-400 font-semibold">ADMIN</span> account to access the control panel.
              {user ? ` Current role: ${role}` : " You are not logged in."}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href={`/login?redirectTo=${encodeURIComponent(pathname)}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-lg shadow-indigo-600/20"
            >
              <span>Sign In as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-colors border border-slate-700/60"
            >
              <Home className="w-4 h-4" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
