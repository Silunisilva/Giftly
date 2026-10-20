"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Store,
  Gift,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  MessageCircle,
  Instagram,
  Globe,
  Trash2
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { Shop, Product } from "@/types";
import { formatLKR } from "@/lib/utils";

export default function AdminPage() {
  const { currentUser, switchRole } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalShops: number;
    totalProducts: number;
    totalSearches: number;
    totalProductViews: number;
    totalOutboundClicks: number;
    breakdown: {
      whatsappClicks: number;
      instagramClicks: number;
      websiteClicks: number;
    };
    recentSearches: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [shopsRes, prodsRes, statsRes] = await Promise.all([
        fetch("/api/shops"),
        fetch("/api/gifts?limit=100"),
        fetch("/api/analytics"),
      ]);

      const shopsJson = await shopsRes.json();
      const prodsJson = await prodsRes.json();
      const statsJson = await statsRes.json();

      if (shopsJson.success) setShops(shopsJson.data);
      if (prodsJson.success) setProducts(prodsJson.data);
      if (statsJson.success) setAnalytics(statsJson.data);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const toggleShopVerification = async (shop: Shop) => {
    try {
      const res = await fetch(`/api/shops/${shop.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !shop.isVerified }),
      });
      const json = await res.json();
      if (json.success) {
        setShops(shops.map(s => s.id === shop.id ? { ...s, isVerified: !s.isVerified } : s));
      }
    } catch (err) {
      console.error("Error toggling shop verification:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product listing?")) return;
    try {
      const res = await fetch(`/api/gifts/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Governance &amp; Administration</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Giftly Admin Console
          </h1>
          <p className="text-xs text-stone-400 max-w-xl">
            Review verified Sri Lankan partner shops, manage gift listings, and monitor discovery and outbound seller metrics.
          </p>
        </div>

        {currentUser.role !== "ADMIN" && (
          <button
            onClick={() => switchRole("ADMIN")}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-sm transition-colors self-start sm:self-auto"
          >
            Switch to Admin Role
          </button>
        )}
      </div>

      {/* Analytics KPI Grid */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Total Shops</span>
            <p className="text-xl font-extrabold text-stone-900">{analytics.totalShops}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Total Gifts</span>
            <p className="text-xl font-extrabold text-stone-900">{analytics.totalProducts}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Search Queries</span>
            <p className="text-xl font-extrabold text-stone-900">{analytics.totalSearches}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Product Views</span>
            <p className="text-xl font-extrabold text-stone-900">{analytics.totalProductViews}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase">WhatsApp Clicks</span>
            <p className="text-xl font-extrabold text-emerald-600">{analytics.breakdown.whatsappClicks}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Instagram Clicks</span>
            <p className="text-xl font-extrabold text-pink-600">{analytics.breakdown.instagramClicks}</p>
          </div>
        </div>
      )}

      {/* Main Sections: Shops Moderation & Search Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shops Management Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Registered Shops ({shops.length})
          </h2>

          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-subtle divide-y divide-stone-100 overflow-hidden text-xs">
            {shops.map((shop) => (
              <div key={shop.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative flex-shrink-0">
                    <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-900 text-sm">{shop.name}</span>
                      {shop.isVerified && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-stone-400">{shop.city} &bull; {shop.categories.slice(0, 2).join(", ")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleShopVerification(shop)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                      shop.isVerified
                        ? "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {shop.isVerified ? "Revoke Badge" : "Verify Shop"}
                  </button>

                  <Link
                    href={`/shops/${shop.slug}`}
                    className="p-1.5 text-stone-400 hover:text-stone-900"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Search Logs (1 col) */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Recent User Searches
          </h2>

          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-subtle space-y-3">
            {analytics?.recentSearches && analytics.recentSearches.length > 0 ? (
              <div className="space-y-2">
                {analytics.recentSearches.map((queryText, idx) => (
                  <div key={idx} className="p-2.5 bg-stone-50 rounded-xl text-xs text-stone-700 font-medium flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <span className="truncate">&ldquo;{queryText}&rdquo;</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 text-center py-6">No search queries logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
