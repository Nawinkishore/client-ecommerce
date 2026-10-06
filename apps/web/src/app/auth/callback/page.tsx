"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { apiClient } from "../../../lib/api-client";
import { useAuth } from "../../../hooks/use-auth";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchUser } = useAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function processCallback() {
      try {
        let accessToken: string | null = searchParams.get("access_token");
        let refreshToken: string | null = searchParams.get("refresh_token");
        let type: string | null = searchParams.get("type");

        // Parse hash fragment if query parameters are missing (Supabase default client behavior)
        if (!accessToken && typeof window !== "undefined" && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          accessToken = hashParams.get("access_token");
          refreshToken = hashParams.get("refresh_token");
          type = hashParams.get("type");
        }

        if (accessToken) {
          localStorage.setItem("token", accessToken);
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }
          localStorage.setItem("auth_event", `callback_${Date.now()}`);

          await refetchUser();
          setStatus("success");

          setTimeout(() => {
            if (type === "recovery") {
              router.push(`/reset-password?access_token=${encodeURIComponent(accessToken!)}`);
            } else {
              router.push("/login?confirmed=true");
            }
          }, 1500);
        } else {
          // If no token in URL, redirect to login
          router.push("/login");
        }
      } catch (err: any) {
        console.error("Callback processing error", err);
        setStatus("error");
        setErrorMessage(err.message || "Failed to process authentication callback");
      }
    }

    processCallback();
  }, [router, searchParams, refetchUser]);

  return (
    <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-xl">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
        <Sparkles className="w-7 h-7 animate-spin" />
      </div>

      {status === "processing" && (
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Verifying Email Confirmation</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Completing your account activation...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Account Activated!</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Redirecting to sign in...</p>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-red-600 dark:text-red-400">Activation Error</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs animate-pulse">
            Processing authentication response...
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
