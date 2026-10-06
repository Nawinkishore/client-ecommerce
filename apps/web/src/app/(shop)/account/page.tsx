"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Lock,
  ShoppingBag,
  Plus,
  Trash2,
  Check,
  Save,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { ProtectedRoute } from "../../../components/auth/ProtectedRoute";
import { Navbar } from "../../../components/shop/Navbar";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../hooks/use-auth";
import { apiClient } from "../../../lib/api-client";

interface Address {
  id: string;
  recipient: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { user, updateProfile, role } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "security">("profile");

  // Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Security Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [secMsg, setSecMsg] = useState({ type: "", text: "" });

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipient: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addrMsg, setAddrMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const res = await apiClient.get("/api/v1/users/me");
      if (res.data?.success && res.data?.data?.addresses) {
        setAddresses(res.data.data.addresses);
      }
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (activeTab === "addresses") {
      fetchAddresses();
    }
  }, [activeTab]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg({ type: "", text: "" });

    try {
      await updateProfile({ fullName, phone });
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecMsg({ type: "", text: "" });

    if (newPassword.length < 8) {
      setSecMsg({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiClient.put("/api/v1/users/me/change-password", { newPassword });
      setSecMsg({ type: "success", text: "Password changed successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setSecMsg({ type: "error", text: err.message || "Failed to update password" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAddress(true);
    setAddrMsg({ type: "", text: "" });

    try {
      const res = await apiClient.post("/api/v1/users/me/addresses", newAddress);
      if (res.data?.success) {
        setAddrMsg({ type: "success", text: "Address added successfully!" });
        setShowAddAddress(false);
        setNewAddress({
          recipient: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
          isDefault: false,
        });
        fetchAddresses();
      }
    } catch (err: any) {
      setAddrMsg({ type: "error", text: err.message || "Failed to add address" });
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await apiClient.delete(`/api/v1/users/me/addresses/${id}`);
      if (res.data?.success) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Banner */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-2xl shadow-lg">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-white">
                    {user?.fullName || "Valued Customer"}
                  </h1>
                  {role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            <Link href="/products">
              <Button variant="outline" size="sm" className="border-slate-800 text-slate-300 hover:text-white">
                <ShoppingBag className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Explore Store</span>
              </Button>
            </Link>
          </div>

          {/* Navigation Tabs & Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all border ${
                  activeTab === "profile"
                    ? "bg-emerald-600/15 border-emerald-500/30 text-emerald-400 shadow-md"
                    : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Personal Profile</span>
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all border ${
                  activeTab === "addresses"
                    ? "bg-emerald-600/15 border-emerald-500/30 text-emerald-400 shadow-md"
                    : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all border ${
                  activeTab === "security"
                    ? "bg-emerald-600/15 border-emerald-500/30 text-emerald-400 shadow-md"
                    : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Security & Password</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* TAB 1: Profile */}
              {activeTab === "profile" && (
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">Personal Information</h2>
                    <p className="text-xs text-slate-400">Update your account profile details and phone contact</p>
                  </div>

                  {profileMsg.text && (
                    <div
                      className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                        profileMsg.type === "success"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                          : "bg-red-500/10 border border-red-500/30 text-red-400"
                      }`}
                    >
                      {profileMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{profileMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                    <Input
                      label="Email Address"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-slate-900/50 opacity-75 cursor-not-allowed"
                    />

                    <Input
                      label="Full Name"
                      type="text"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={isUpdatingProfile}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      <span>Save Changes</span>
                    </Button>
                  </form>
                </div>
              )}

              {/* TAB 2: Addresses */}
              {activeTab === "addresses" && (
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-100">Saved Addresses</h2>
                      <p className="text-xs text-slate-400">Manage delivery locations for quick checkout</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddAddress(!showAddAddress)}
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      <span>{showAddAddress ? "Cancel" : "Add Address"}</span>
                    </Button>
                  </div>

                  {addrMsg.text && (
                    <div
                      className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                        addrMsg.type === "success"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                          : "bg-red-500/10 border border-red-500/30 text-red-400"
                      }`}
                    >
                      {addrMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{addrMsg.text}</span>
                    </div>
                  )}

                  {/* Add Address Form */}
                  {showAddAddress && (
                    <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 space-y-4">
                      <h3 className="text-sm font-bold text-emerald-400">New Address Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Recipient Name"
                          value={newAddress.recipient}
                          onChange={(e) => setNewAddress({ ...newAddress, recipient: e.target.value })}
                          required
                        />
                        <Input
                          label="Street Address"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          required
                        />
                        <Input
                          label="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          required
                        />
                        <Input
                          label="State / Province"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          required
                        />
                        <Input
                          label="Postal Code"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          required
                        />
                        <Input
                          label="Country"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                          className="rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="isDefault" className="text-xs text-slate-300 font-medium">
                          Set as default delivery address
                        </label>
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={isSavingAddress}
                        className="bg-emerald-600 text-white"
                      >
                        <span>Save Address</span>
                      </Button>
                    </form>
                  )}

                  {/* Address Cards List */}
                  {isLoadingAddresses ? (
                    <div className="text-center py-8 text-xs text-slate-500 animate-pulse">Loading addresses...</div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl space-y-2">
                      <MapPin className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">No saved addresses found.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3 relative group">
                          {addr.isDefault && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                              <Check className="w-3 h-3" />
                              <span>Default</span>
                            </span>
                          )}
                          <h4 className="text-sm font-bold text-slate-200">{addr.recipient}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                          </p>
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                              title="Delete Address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Security */}
              {activeTab === "security" && (
                <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">Security & Password</h2>
                    <p className="text-xs text-slate-400">Update your account password</p>
                  </div>

                  {secMsg.text && (
                    <div
                      className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                        secMsg.type === "success"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                          : "bg-red-500/10 border border-red-500/30 text-red-400"
                      }`}
                    >
                      {secMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{secMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={isChangingPassword}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      <span>Update Password</span>
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
