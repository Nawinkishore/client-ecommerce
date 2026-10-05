"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient } from "../lib/api-client";

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthContextType {
  user: UserProfile | null;
  role: "CUSTOMER" | "ADMIN";
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.get("/api/v1/users/me");
      if (res.data?.success) {
        setUser(res.data.data);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (err) {
      console.error("Auth session check failed", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const res = await apiClient.post("/api/v1/auth/login", { email, password });
    if (res.data?.success) {
      const { user: userProfile, session } = res.data.data;
      if (session?.accessToken) {
        localStorage.setItem("token", session.accessToken);
      }
      setUser(userProfile);
      return userProfile;
    }
    throw new Error(res.data?.message || "Login failed");
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ): Promise<UserProfile> => {
    const res = await apiClient.post("/api/v1/auth/signup", { email, password, fullName, phone });
    if (res.data?.success) {
      const { user: userProfile, session } = res.data.data;
      if (session?.accessToken) {
        localStorage.setItem("token", session.accessToken);
      }
      setUser(userProfile);
      return userProfile;
    }
    throw new Error(res.data?.message || "Registration failed");
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

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "CUSTOMER",
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refetchUser: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
