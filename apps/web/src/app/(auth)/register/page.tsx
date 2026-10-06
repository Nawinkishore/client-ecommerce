"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight, UserCheck } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../hooks/use-auth";
import { apiClient } from "../../../lib/api-client";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const { register, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmationSent, setIsConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await register(email, password, fullName);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage("");
    try {
      const res = await apiClient.post("/api/v1/auth/resend-confirmation", { email });
      setResendMessage(res.data?.message || "Confirmation email resent!");
    } catch (err: any) {
      setResendMessage(err.message || "Failed to resend confirmation email.");
    } finally {
      setIsResending(false);
    }
  };

  if (isConfirmationSent) {
    return (
      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <UserCheck className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Check Your Email</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We have sent a verification email to <span className="font-semibold text-emerald-600 dark:text-emerald-400">{email}</span>.
            Please click the confirmation link in the message to complete your registration.
          </p>
        </div>

        {resendMessage && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-400 text-center font-medium">
            {resendMessage}
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResendEmail}
            isLoading={isResending}
            className="w-full justify-center text-xs border-slate-300 dark:border-slate-700"
          >
            <span>Resend Confirmation Email</span>
          </Button>

          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-lg shadow-emerald-600/20"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl transition-colors duration-300">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl tracking-tight">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>Sreesoap</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create Account</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Join Sreesoap for express organic skincare delivery</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 dark:text-red-400 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
        >
          <span>Create Account</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have a Sreesoap account?{" "}
        <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <Suspense fallback={
        <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs animate-pulse">
          Loading registration interface...
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
