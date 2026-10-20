"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Tag,
  Store,
  MapPin,
  RefreshCw,
  Gift
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { Product, Shop, Category, Occasion } from "@/types";
import { INITIAL_CATEGORIES, INITIAL_OCCASIONS, INITIAL_SHOPS } from "@/lib/data/seed-data";
import { formatLKR } from "@/lib/utils";

function GiftsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State parameters
  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialOccasion = searchParams.get("occasion") || "";
  const initialRecipient = searchParams.get("recipient") || "";
  const initialGiftType = searchParams.get("giftType") || "";
  const initialShop = searchParams.get("shopSlug") || "";
  const initialDistrict = searchParams.get("district") || "";
  const initialSort = searchParams.get("sort") || "recommended";
  const initialMinPrice = searchParams.get("minPrice") || "";
  const initialMaxPrice = searchParams.get("maxPrice") || "";

  // Local state
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [selectedRecipient, setSelectedRecipient] = useState(initialRecipient);
  const [selectedGiftType, setSelectedGiftType] = useState(initialGiftType);
  const [selectedShop, setSelectedShop] = useState(initialShop);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice ? Number(initialMaxPrice) : 25000);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state when URL searchParams change
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedOccasion(searchParams.get("occasion") || "");
    setSelectedRecipient(searchParams.get("recipient") || "");
    setSelectedGiftType(searchParams.get("giftType") || "");
    setSelectedShop(searchParams.get("shopSlug") || "");
    setSelectedDistrict(searchParams.get("district") || "");
    setSelectedSort(searchParams.get("sort") || "recommended");
    if (searchParams.get("maxPrice")) {
      setMaxPrice(Number(searchParams.get("maxPrice")));
    }
  }, [searchParams]);

  // Fetch products from API based on active filters
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedOccasion) params.set("occasion", selectedOccasion);
      if (selectedRecipient) params.set("recipient", selectedRecipient);
      if (selectedGiftType) params.set("giftType", selectedGiftType);
      if (selectedShop) params.set("shopSlug", selectedShop);
      if (selectedDistrict) params.set("district", selectedDistrict);
      if (selectedSort) params.set("sort", selectedSort);
      if (maxPrice < 25000) params.set("maxPrice", maxPrice.toString());

      const res = await fetch(`/api/gifts?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      }
    } catch (err) {
      console.error("Error fetching filtered gifts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [
    query,
    selectedCategory,
    selectedOccasion,
    selectedRecipient,
    selectedGiftType,
    selectedShop,
    selectedDistrict,
    selectedSort,
    maxPrice
  ]);

  const updateUrlFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/gifts?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedOccasion("");
    setSelectedRecipient("");
    setSelectedGiftType("");
    setSelectedShop("");
    setSelectedDistrict("");
    setSelectedSort("recommended");
    setMaxPrice(25000);
    router.push("/gifts");
  };

  const recipientOptions = [
    "Girlfriend", "Boyfriend", "Mom", "Dad", "Sister", "Brother", "Friend", "Wife", "Husband", "Colleague", "Child", "Couple"
  ];

  const giftTypes = [
    "Romantic", "Cute", "Useful", "Luxurious", "Personalized", "Surprising"
  ];

  const districts = ["Colombo", "Gampaha", "Kandy", "Galle"];

  const activeFilterCount = [
    Boolean(query),
    Boolean(selectedCategory),
    Boolean(selectedOccasion),
    Boolean(selectedRecipient),
    Boolean(selectedGiftType),
    Boolean(selectedShop),
    Boolean(selectedDistrict),
    maxPrice < 25000
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Discover Gifts in Sri Lanka
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Browse curated items from local florists, bakeries, artisan crafters, and boutiques.
            </p>
          </div>

          {/* Search bar inside discovery */}
          <div className="w-full md:w-96 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                updateUrlFilters({ query: e.target.value || null });
              }}
              placeholder="Filter by keyword (e.g. roses, spa, coffee)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-sm rounded-2xl border border-stone-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none shadow-xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  updateUrlFilters({ query: null });
                }}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Badges Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-stone-500">Active Filters:</span>
            {query && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-800 px-3 py-1 rounded-full font-medium">
                Keyword: &ldquo;{query}&rdquo;
                <button onClick={() => { setQuery(""); updateUrlFilters({ query: null }); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 text-xs bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full font-medium">
                Category: {selectedCategory}
                <button onClick={() => { setSelectedCategory(""); updateUrlFilters({ category: null }); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedOccasion && (
              <span className="inline-flex items-center gap-1 text-xs bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full font-medium">
                Occasion: {selectedOccasion}
                <button onClick={() => { setSelectedOccasion(""); updateUrlFilters({ occasion: null }); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedRecipient && (
              <span className="inline-flex items-center gap-1 text-xs bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full font-medium">
                For: {selectedRecipient}
                <button onClick={() => { setSelectedRecipient(""); updateUrlFilters({ recipient: null }); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedGiftType && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-800 px-3 py-1 rounded-full font-medium">
                Style: {selectedGiftType}
                <button onClick={() => { setSelectedGiftType(""); updateUrlFilters({ giftType: null }); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedShop && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-800 px-3 py-1 rounded-full font-medium">
                Shop: {INITIAL_SHOPS.find(s => s.slug === selectedShop)?.name || selectedShop}
                <button onClick={() => { setSelectedShop(""); updateUrlFilters({ shopSlug: null }); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedDistrict && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-800 px-3 py-1 rounded-full font-medium">
                District: {selectedDistrict}
                <button onClick={() => { setSelectedDistrict(""); updateUrlFilters({ district: null }); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            {maxPrice < 25000 && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-800 px-3 py-1 rounded-full font-medium">
                Under {formatLKR(maxPrice)}
                <button onClick={() => { setMaxPrice(25000); updateUrlFilters({ maxPrice: null }); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                Filter Gifts
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-stone-400 hover:text-rose-600 font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">Max Budget</span>
                <span className="font-extrabold text-rose-600">{formatLKR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={25000}
                step={500}
                value={maxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaxPrice(val);
                  updateUrlFilters({ maxPrice: val < 25000 ? val.toString() : null });
                }}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>LKR 2,000</span>
                <span>LKR 25,000+</span>
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-stone-800 block">Occasion</label>
              <select
                value={selectedOccasion}
                onChange={(e) => {
                  setSelectedOccasion(e.target.value);
                  updateUrlFilters({ occasion: e.target.value || null });
                }}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-rose-400"
              >
                <option value="">All Occasions</option>
                {INITIAL_OCCASIONS.map((occ) => (
                  <option key={occ.id} value={occ.name}>{occ.icon} {occ.name}</option>
                ))}
              </select>
            </div>

            {/* Recipient Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-stone-800 block">Recipient</label>
              <select
                value={selectedRecipient}
                onChange={(e) => {
                  setSelectedRecipient(e.target.value);
                  updateUrlFilters({ recipient: e.target.value || null });
                }}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-rose-400"
              >
                <option value="">All Recipients</option>
                {recipientOptions.map((rec) => (
                  <option key={rec} value={rec}>{rec}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-stone-800 block">Category</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    updateUrlFilters({ category: null });
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    !selectedCategory ? "bg-rose-50 text-rose-700 font-bold" : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {INITIAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      const next = selectedCategory === cat.name ? "" : cat.name;
                      setSelectedCategory(next);
                      updateUrlFilters({ category: next || null });
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat.name ? "bg-rose-50 text-rose-700 font-bold" : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <span>{cat.icon} {cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gift Style Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-stone-800 block">Gift Style / Vibe</label>
              <div className="flex flex-wrap gap-1.5">
                {giftTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      const next = selectedGiftType === type ? "" : type;
                      setSelectedGiftType(next);
                      updateUrlFilters({ giftType: next || null });
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      selectedGiftType === type
                        ? "bg-stone-900 text-white border-stone-900 font-semibold"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-stone-800 block">Shop</label>
              <select
                value={selectedShop}
                onChange={(e) => {
                  setSelectedShop(e.target.value);
                  updateUrlFilters({ shopSlug: e.target.value || null });
                }}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-rose-400"
              >
                <option value="">All Verified Shops</option>
                {INITIAL_SHOPS.map((shop) => (
                  <option key={shop.id} value={shop.slug}>{shop.name}</option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-stone-800 block">Location (District)</label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  updateUrlFilters({ district: e.target.value || null });
                }}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-rose-400"
              >
                <option value="">All Regions</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar with Sort and Count */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-xs font-semibold text-stone-600">
              Showing <strong className="text-stone-900">{products.length}</strong> gift ideas
            </span>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Trigger Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-xs font-bold text-stone-800 rounded-xl"
              >
                <Filter className="w-3.5 h-3.5" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400 hidden sm:inline">Sort:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    updateUrlFilters({ sort: e.target.value });
                  }}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 outline-none font-medium focus:border-rose-400"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest Added</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products List or Loading / Empty state */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-80 animate-pulse border border-stone-200/60 p-4 space-y-3">
                  <div className="bg-stone-200 h-44 rounded-2xl"></div>
                  <div className="bg-stone-200 h-4 w-3/4 rounded"></div>
                  <div className="bg-stone-200 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-4 max-w-md mx-auto my-8 shadow-subtle">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-900">No matching gifts found</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We couldn&apos;t find any gifts matching your specific combination of filters. Try clearing some criteria or searching for something else!
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Discovery Notice */}
          <DisclaimerBanner />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-[85%] max-w-sm bg-white h-full p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-rose-600" />
                Filter Gifts
              </span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">Max Budget</label>
                <span className="font-extrabold text-rose-600 text-sm">{formatLKR(maxPrice)}</span>
                <input
                  type="range"
                  min={2000}
                  max={25000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-rose-600 mt-2"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">Occasion</label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="">All Occasions</option>
                  {INITIAL_OCCASIONS.map((occ) => (
                    <option key={occ.id} value={occ.name}>{occ.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">Recipient</label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="">All Recipients</option>
                  {recipientOptions.map((rec) => (
                    <option key={rec} value={rec}>{rec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="">All Categories</option>
                  {INITIAL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">Shop</label>
                <select
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                >
                  <option value="">All Shops</option>
                  {INITIAL_SHOPS.map((shop) => (
                    <option key={shop.id} value={shop.slug}>{shop.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2">
              <button
                onClick={() => {
                  updateUrlFilters({
                    occasion: selectedOccasion || null,
                    recipient: selectedRecipient || null,
                    category: selectedCategory || null,
                    shopSlug: selectedShop || null,
                    maxPrice: maxPrice < 25000 ? maxPrice.toString() : null,
                  });
                  setIsMobileFiltersOpen(false);
                }}
                className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFiltersOpen(false);
                }}
                className="w-full py-2 bg-stone-100 text-stone-700 font-semibold rounded-xl text-xs"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GiftsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-stone-400">Loading discovery catalog...</div>}>
      <GiftsContent />
    </Suspense>
  );
}
