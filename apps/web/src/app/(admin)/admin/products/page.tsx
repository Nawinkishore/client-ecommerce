"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Package, Edit, Trash2 } from "lucide-react";
import { apiClient } from "../../../../lib/api-client";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { Skeleton } from "../../../../components/ui/Skeleton";
import { Modal } from "../../../../components/ui/Modal";
import { Input } from "../../../../components/ui/Input";

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/products?limit=50");
      return res.data?.data || [];
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Product Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage catalog inventory, pricing, and variant options.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Product Title</th>
              <th className="px-5 py-3.5">Slug</th>
              <th className="px-5 py-3.5">Base Price</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx}>
                  <td colSpan={5} className="px-5 py-4">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))
            ) : products?.length > 0 ? (
              products.map((prod: any) => (
                <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                      <img src={prod.images?.[0]?.url || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span>{prod.title}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">{prod.slug}</td>
                  <td className="px-5 py-4 font-bold text-indigo-400">${prod.basePrice.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <Badge variant={prod.isActive ? "success" : "danger"}>
                      {prod.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button className="p-1 text-slate-400 hover:text-indigo-400 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                  No products in catalog.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Product">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <Input label="Title" placeholder="Studio Workstation Pro" required />
          <Input label="Slug" placeholder="studio-workstation-pro" required />
          <Input label="Base Price ($)" type="number" step="0.01" placeholder="1299.99" required />
          <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
            Save Product
          </Button>
        </form>
      </Modal>
    </div>
  );
}
