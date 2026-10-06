"use client";

import React, { createContext, useContext } from "react";
import { authClient, useSession, signIn, signUp, signOut } from "../lib/auth-client";
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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  updateProfile: (data: { fullName?: string; phone?: string; avatarUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: sessionData, isPending, refetch } = useSession();

  const user: UserProfile | null = sessionData?.user
    ? {
        id: sessionData.user.id,
        userId: sessionData.user.id,
        email: sessionData.user.email,
        fullName: sessionData.user.name || undefined,
        role: ((sessionData.user as { role?: string }).role as "CUSTOMER" | "ADMIN") || "CUSTOMER",
      }
    : null;

  const login = async (email: string, password: string): Promise<void> => {
    const res = await signIn.email({ email, password });
    if (res.error) {
      throw new Error(res.error.message || "Failed to sign in");
    }
    await refetch();
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    _phone?: string
  ): Promise<void> => {
    const res = await signUp.email({ email, password, name: fullName });
    if (res.error) {
      throw new Error(res.error.message || "Failed to create account");
    }
    await refetch();
  };

  const logout = async (): Promise<void> => {
    await signOut();
    await refetch();
  };

  const refetchUser = async (): Promise<void> => {
    await refetch();
  };

  const updateProfile = async (data: { fullName?: string; phone?: string; avatarUrl?: string }) => {
    const res = await apiClient.put("/api/v1/users/me", data);
    if (!res.data?.success) {
      throw new Error(res.data?.message || "Failed to update profile");
    }
    await refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "CUSTOMER",
        isAuthenticated: !!user,
        isLoading: isPending,
        login,
        register,
        logout,
        refetchUser,
        updateProfile,
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
