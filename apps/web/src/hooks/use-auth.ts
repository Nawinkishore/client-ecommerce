"use client";

import { useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: "CUSTOMER" | "ADMIN";
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await apiClient.get("/api/v1/users/me");
        if (res.data?.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.error("Auth session expired", err);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post("/api/v1/auth/login", { email, password });
    if (res.data?.success) {
      const { session, profile } = res.data.data;
      if (session?.access_token) {
        localStorage.setItem("token", session.access_token);
      }
      setUser(profile);
      return profile;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    const res = await apiClient.post("/api/v1/auth/signup", { email, password, fullName });
    if (res.data?.success) {
      const { session, profile } = res.data.data;
      if (session?.access_token) {
        localStorage.setItem("token", session.access_token);
      }
      setUser(profile);
      return profile;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } catch (e) {
      console.warn("Logout request failed", e);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return {
    user,
    role: user?.role || "CUSTOMER",
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };
}
