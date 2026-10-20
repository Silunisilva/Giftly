"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Store, Gift, Compass } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ShopCard from "@/components/ShopCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { Product, Shop } from "@/types";
import { useAuth } from "@/lib/auth/auth-context";

export default function FavoritesPage() {
  const { currentUser, favorites } = useAuth();
  const [activeTab, setActiveTab] = useState<"gifts" | "shops">("gifts");
  const [favProducts, setFavProducts] = useState<Product[]>([]);
  const [favShops, setFavShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);
      try {
        const res = await fetch(`/api/favorites?userId=${currentUser.id}`);
        const json = await res.json();
        if (json.success) {
          setFavProducts(json.data.products || []);
          setFavShops(json.data.shops || []);
        }
      } catch (err) {
        console.error("Error loading favorites:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [currentUser.id, favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Saved Shortlist</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Your Favorites
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Keep track of gift ideas and verified shops you love before you make your decision.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("gifts")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "gifts"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-rose-500" />
            <span>Saved Gifts ({favProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("shops")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "shops"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>Saved Shops ({favShops.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-3xl h-64 animate-pulse border border-stone-200/60"></div>
          ))}
        </div>
      ) : activeTab === "gifts" ? (
        favProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-4 shadow-subtle">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">No Saved Gifts Yet</h3>
            <p className="text-xs text-stone-500">
              Click the heart icon on any gift card while browsing to bookmark it to your shortlist!
            </p>
            <Link
              href="/gifts"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        )
      ) : favShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favShops.map(shop => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-4 shadow-subtle">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Store className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">No Saved Shops Yet</h3>
          <p className="text-xs text-stone-500">
            Bookmark your favorite Sri Lankan boutiques and bakeries to revisit their listings anytime.
          </p>
          <Link
            href="/shops"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Explore Shops Directory</span>
          </Link>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}
