"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Truck, CheckCircle2, Clock } from "lucide-react";
import { apiClient } from "../../../../lib/api-client";
import { Badge } from "../../../../components/ui/Badge";
import { Skeleton } from "../../../../components/ui/Skeleton";

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/orders");
      return res.data?.data || [
        {
          id: "ord-1",
          orderNumber: "ORD-982134",
          totalAmount: 2499.99,
          paymentStatus: "PAID",
          fulfillmentStatus: "PROCESSING",
          createdAt: new Date().toISOString(),
        },
      ];
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Order Management</h1>
        <p className="text-xs text-slate-400 mt-1">Fulfill customer purchases, issue tracking numbers, and update delivery status.</p>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Order #</th>
              <th className="px-5 py-3.5">Total Amount</th>
              <th className="px-5 py-3.5">Payment</th>
              <th className="px-5 py-3.5">Fulfillment Status</th>
              <th className="px-5 py-3.5 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={5} className="px-5 py-4">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))
            ) : orders?.length > 0 ? (
              orders.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-indigo-400">{ord.orderNumber}</td>
                  <td className="px-5 py-4 font-bold text-slate-100">${(ord.totalAmount || 0).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <Badge variant={ord.paymentStatus === "PAID" ? "success" : "warning"}>
                      {ord.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="primary">{ord.fulfillmentStatus}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <select defaultValue={ord.fulfillmentStatus} className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1">
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
