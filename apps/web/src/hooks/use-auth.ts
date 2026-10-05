"use client";

import { useAuthContext, UserProfile } from "../context/auth-context";

export type { UserProfile };

export function useAuth() {
  return useAuthContext();
}
