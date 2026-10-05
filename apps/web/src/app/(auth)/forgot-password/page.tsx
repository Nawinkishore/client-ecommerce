"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { apiClient } from "../../../lib/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await apiClient.post("/api/v1/auth/forgot-password", { email });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl tracking-tight">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>Sreesoap</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reset Password</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                If an account with <strong className="text-emerald-600 dark:text-emerald-400">{email}</strong> exists, check your inbox for reset instructions.
              </p>
            </div>
            <Link href="/login" className="inline-block w-full">
              <Button variant="outline" className="w-full justify-center border-slate-300 dark:border-slate-700">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Return to Sign In</span>
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 dark:text-red-400 text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="pt-2 text-center">
              <Link href="/login" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
