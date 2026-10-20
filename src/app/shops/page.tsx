"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Store, Search, MapPin, CheckCircle, Sparkles, Filter } from "lucide-react";
import ShopCard from "@/components/ShopCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { Shop } from "@/types";

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const districts = ["Colombo", "Gampaha", "Kandy", "Galle"];
  const categories = [
    "Flowers & Bouquets",
    "Beauty & Skincare",
    "Curated Gift Boxes",
    "Cakes & Desserts",
    "Chocolates & Sweets",
    "Jewellery & Keepsakes",
    "Handmade & Crafts",
    "Home & Lifestyle",
    "Perfumes & Scents",
    "Plants & Succulents",
    "Stationery & Books"
  ];

  useEffect(() => {
    async function loadShops() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedDistrict) params.set("district", selectedDistrict);
        if (selectedCategory) params.set("category", selectedCategory);

        const res = await fetch(`/api/shops?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setShops(json.data);
        }
      } catch (err) {
        console.error("Error loading shops:", err);
      } finally {
        setLoading(false);
      }
    }
    loadShops();
  }, [selectedDistrict, selectedCategory]);

  const filteredShops = shops.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.categories.some(c => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Shop Directory</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Verified Sri Lankan Gift Shops
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Discover local boutiques, artisan creators, florists, and bakers across Colombo, Kandy, Galle and more.
          </p>
        </div>

        <Link
          href="/shop-portal"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold rounded-2xl transition-colors shadow-sm self-start md:self-auto"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Register Your Shop</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shops by name, specialty, or area..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:border-rose-400 outline-none"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none flex-1 md:flex-none"
          >
            <option value="">All Districts</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none flex-1 md:flex-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Shop Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-3xl h-72 animate-pulse border border-stone-200/60"></div>
          ))}
        </div>
      ) : filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map(shop => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-3">
          <p className="font-serif text-lg font-bold text-stone-900">No shops found matching your search</p>
          <p className="text-xs text-stone-500">Try adjusting your district or search keywords.</p>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}
