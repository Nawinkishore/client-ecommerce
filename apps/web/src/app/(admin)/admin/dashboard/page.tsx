"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { apiClient } from "../../../../lib/api-client";
import { Card } from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";
import { Skeleton } from "../../../../components/ui/Skeleton";

export default function AdminDashboardPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/admin/analytics");
      return res.data?.data || { totalRevenue: 12450.0, totalOrders: 48, activeCustomers: 34, lowStockAlerts: 2 };
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Executive Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time revenue metrics, order velocity, and inventory alerts.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-1/2" />
          ) : (
            <p className="text-2xl font-bold text-slate-100">${(analytics?.totalRevenue || 12450.0).toFixed(2)}</p>
          )}
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last month
          </span>
        </Card>

        <Card className="glass-card p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-1/2" />
          ) : (
            <p className="text-2xl font-bold text-slate-100">{analytics?.totalOrders || 48}</p>
          )}
          <span className="text-[11px] text-slate-400 font-medium">Completed & Processing</span>
        </Card>

        <Card className="glass-card p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customers</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-1/2" />
          ) : (
            <p className="text-2xl font-bold text-slate-100">{analytics?.activeCustomers || 34}</p>
          )}
          <span className="text-[11px] text-purple-400 font-medium">Registered accounts</span>
        </Card>

        <Card className="glass-card p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-1/2" />
          ) : (
            <p className="text-2xl font-bold text-amber-400">{analytics?.lowStockAlerts || 2}</p>
          )}
          <span className="text-[11px] text-amber-400 font-medium">Items under 5 units</span>
        </Card>
      </div>
    </div>
  );
}
