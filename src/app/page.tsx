"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  ArrowRight,
  Heart,
  HelpCircle,
  Gift,
  Store,
  CheckCircle,
  Compass,
  Smile,
  ShieldCheck,
  TrendingUp,
  MapPin,
  MessageCircle,
  Instagram
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ShopCard from "@/components/ShopCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { INITIAL_CATEGORIES, INITIAL_OCCASIONS, INITIAL_SHOPS, INITIAL_PRODUCTS } from "@/lib/data/seed-data";
import { formatLKR } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [heroSearchQuery, setHeroSearchQuery] = useState("");
  const [activeTabOccasion, setActiveTabOccasion] = useState("Birthday");

  // Sample prompt chips
  const samplePrompts = [
    "Birthday gift for my girlfriend under LKR 5,000",
    "Ayurvedic skincare gift set for mom",
    "Romantic anniversary flowers & chocolate box",
    "Graduation sunflower bouquet for best friend",
    "Coffee & leather gifts for boyfriend under 10k"
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearchQuery.trim()) return;
    router.push(`/gifts?query=${encodeURIComponent(heroSearchQuery.trim())}`);
  };

  const recipients = [
    { name: "Girlfriend", emoji: "❤️", query: "Girlfriend", desc: "Flowers, jewelry, cute gift boxes" },
    { name: "Boyfriend", emoji: "⚡", query: "Boyfriend", desc: "Coffee sets, leather, scents" },
    { name: "Mom", emoji: "💐", query: "Mom", desc: "Ayurveda, herbal teas, silk scarves" },
    { name: "Dad", emoji: "👔", query: "Dad", desc: "Artisan teas, diffusers, leather" },
    { name: "Sister", emoji: "🌸", query: "Sister", desc: "Pastel stationery, skincare, sweets" },
    { name: "Best Friend", emoji: "👯", query: "Friend", desc: "Cakes, succulent terrariums, mugs" },
    { name: "Wife", emoji: "💍", query: "Wife", desc: "Sapphire pendants, luxury roses" },
    { name: "Colleague", emoji: "💼", query: "Colleague", desc: "Ceramic mugs, desk kits, cookies" },
  ];

  const featuredGifts = INITIAL_PRODUCTS.filter(p => p.isFeatured).slice(0, 6);
  const trendingShops = INITIAL_SHOPS.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 gradient-hero overflow-hidden">
        {/* Floating background decorative blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-rose-200/50 via-pink-100/40 to-amber-100/50 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-sm text-xs font-semibold text-rose-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Sri Lanka&apos;s Smart AI Gift Discovery Engine</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.1]">
            Find the perfect gift. <br className="hidden sm:inline" />
            <span className="gradient-text">From the right shop.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Tell us who you&apos;re shopping for, your budget, and what they love. We&apos;ll discover curated gift ideas from authentic Sri Lankan shops you&apos;ll actually want to buy from.
          </p>

          {/* Primary AI Search Bar Container */}
          <div className="pt-4 max-w-2xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="p-2 sm:p-2.5 bg-white rounded-3xl sm:rounded-full shadow-card border border-stone-200 focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-100 transition-all flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-3 w-full pl-3 sm:pl-4">
                <Search className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <input
                  type="text"
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  placeholder="e.g. Birthday gift for my girlfriend under LKR 5,000..."
                  className="w-full bg-transparent text-sm sm:text-base outline-none text-stone-800 placeholder:text-stone-400 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:opacity-95 text-white font-bold text-sm rounded-2xl sm:rounded-full shadow-md shadow-rose-200 flex items-center justify-center gap-2 flex-shrink-0 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find Gifts</span>
              </button>
            </form>

            {/* Prompt Suggestion Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
                Try asking:
              </span>
              {samplePrompts.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setHeroSearchQuery(prompt);
                    router.push(`/gifts?query=${encodeURIComponent(prompt)}`);
                  }}
                  className="text-xs bg-white/80 hover:bg-rose-50 hover:text-rose-700 text-stone-600 px-3 py-1.5 rounded-full border border-stone-200/80 transition-all shadow-2xs text-left"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/gifts"
              className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-2xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Browse All Gifts
            </Link>
            <Link
              href="/quiz"
              className="px-6 py-3 bg-rose-100 hover:bg-rose-200 text-rose-900 text-sm font-bold rounded-2xl transition-colors flex items-center gap-2 border border-rose-200"
            >
              <HelpCircle className="w-4 h-4 text-rose-600" />
              I have no idea what to buy 😭
            </Link>
          </div>
        </div>
      </section>

      {/* "I Have No Idea What To Buy" Special Entry Point */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900 via-rose-800 to-pink-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
            <Gift className="w-96 h-96" />
          </div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-rose-100">
              <span>Quick 5-Question Gift Matcher</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              &ldquo;I have no idea what to buy 😭&rdquo;
            </h2>
            <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
              Stuck on gift ideas? Answer 5 quick questions about the person, occasion, and your budget. Our AI recommendation engine will calculate their gift style (e.g. <em>Thoughtful + Romantic</em>) and generate the top 5 perfect picks!
            </p>
            <div className="pt-2">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-rose-50 text-rose-900 text-sm font-extrabold rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <span>Start 2-Minute Gift Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Occasions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Celebration Moments</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Popular Occasions</h2>
          </div>
          <Link href="/gifts" className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
            Explore all occasions &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {INITIAL_OCCASIONS.map((occ) => (
            <Link
              key={occ.id}
              href={`/gifts?occasion=${encodeURIComponent(occ.name)}`}
              className="p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-rose-300 hover:shadow-subtle transition-all text-center group flex flex-col items-center justify-center gap-2"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{occ.icon}</span>
              <span className="text-xs font-bold text-stone-800 group-hover:text-rose-600 transition-colors">
                {occ.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Recipients Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Shopping For Someone Special</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Popular Recipients</h2>
          </div>
          <Link href="/recipients" className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
            Manage saved loved ones &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recipients.map((rec) => (
            <Link
              key={rec.name}
              href={`/gifts?recipient=${encodeURIComponent(rec.query)}`}
              className="p-5 bg-white rounded-3xl border border-stone-200/80 hover:border-rose-300 shadow-subtle gift-card-hover transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2 bg-rose-50 rounded-2xl group-hover:bg-rose-100 transition-colors">
                  {rec.emoji}
                </span>
                <span className="text-[11px] font-semibold text-rose-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Find &rarr;
                </span>
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900 group-hover:text-rose-600 transition-colors">
                  {rec.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-1">{rec.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curated Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Curated Collections</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Explore by Category</h2>
          </div>
          <Link href="/gifts" className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
            View all categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {INITIAL_CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/gifts?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-48 rounded-3xl overflow-hidden border border-stone-200/80 shadow-subtle"
            >
              {cat.imageUrl && (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xl mb-1 block">{cat.icon}</span>
                <h3 className="font-bold text-sm sm:text-base leading-snug">{cat.name}</h3>
                <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Curated Gifts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Editor&apos;s Selection</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Trending Handpicked Gifts</h2>
          </div>
          <Link
            href="/gifts"
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            Browse all {INITIAL_PRODUCTS.length}+ gifts &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGifts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              matchScore={94}
              matchReason="Trending favorite across Sri Lankan florists & creators"
            />
          ))}
        </div>
      </section>

      {/* Verified Sri Lankan Shops Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Authentic Local Sellers</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Featured Sri Lankan Shops</h2>
          </div>
          <Link href="/shops" className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
            View all shops &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      {/* Discovery Platform Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisclaimerBanner />
      </section>
    </div>
  );
}
