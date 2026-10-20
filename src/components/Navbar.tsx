"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  Heart,
  Scale,
  User as UserIcon,
  Store,
  Shield,
  Menu,
  X,
  Compass,
  HelpCircle,
  Users
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { UserRole } from "@/types";

export default function Navbar() {
  const router = useRouter();
  const { currentUser, switchRole, favorites, compareList } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/gifts?query=${encodeURIComponent(searchQuery.trim())}`);
  };

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: "USER",
      label: "Gift Shopper (Siluni)",
      desc: "Discover gifts, save favorites & profiles",
      icon: <UserIcon className="w-4 h-4 text-rose-600" />
    },
    {
      role: "SHOP_OWNER",
      label: "Shop Owner (Bloom House)",
      desc: "Manage discovery listings & analytics",
      icon: <Store className="w-4 h-4 text-emerald-600" />
    },
    {
      role: "ADMIN",
      label: "Platform Admin",
      desc: "Verify shops, moderate & platform metrics",
      icon: <Shield className="w-4 h-4 text-amber-600" />
    }
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all">
      {/* Top Notification Banner */}
      <div className="bg-rose-50 border-b border-rose-100 text-rose-900 text-xs py-1.5 px-4 text-center font-medium hidden sm:block">
        🇱🇰 Sri Lanka&apos;s Curated Gift Discovery Platform &bull; We connect you directly with authentic local shops and artisan creators.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl tracking-tight text-stone-900 group-hover:text-rose-600 transition-colors">
                Giftly<span className="text-rose-600">.</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 -mt-1">
                Discovery &bull; Sri Lanka
              </span>
            </div>
          </Link>

          {/* AI Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask AI: 'Birthday gift for my girlfriend under 5000'..."
                className="w-full pl-10 pr-24 py-2.5 bg-stone-100/90 hover:bg-stone-100 focus:bg-white text-sm rounded-full border border-stone-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100/60 transition-all outline-none text-stone-800 placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full text-xs font-semibold hover:opacity-95 shadow-sm transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Find
              </button>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            <Link href="/gifts" className="hover:text-rose-600 transition-colors flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-stone-400" />
              Browse Gifts
            </Link>
            <Link href="/quiz" className="text-rose-600 hover:text-rose-700 font-semibold transition-colors flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
              <HelpCircle className="w-4 h-4" />
              What to Buy?
            </Link>
            <Link href="/shops" className="hover:text-rose-600 transition-colors flex items-center gap-1.5">
              <Store className="w-4 h-4 text-stone-400" />
              Shops
            </Link>
            <Link href="/recipients" className="hover:text-rose-600 transition-colors flex items-center gap-1.5">
              <Users className="w-4 h-4 text-stone-400" />
              Recipients
            </Link>
          </nav>

          {/* User Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Compare Counter */}
            {compareList.length > 0 && (
              <Link
                href="/compare"
                className="relative p-2 rounded-full hover:bg-stone-100 text-stone-700 transition-colors hidden sm:flex items-center justify-center"
                title="Compare Gifts"
              >
                <Scale className="w-5 h-5 text-stone-600" />
                <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {compareList.length}
                </span>
              </Link>
            )}

            {/* Favorites Counter */}
            <Link
              href="/favorites"
              className="relative p-2 rounded-full hover:bg-rose-50 text-stone-700 hover:text-rose-600 transition-colors flex items-center justify-center"
              title="Saved Gifts & Shops"
            >
              <Heart className="w-5 h-5 text-rose-500" />
              {favorites.productIds.length + favorites.shopIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {favorites.productIds.length + favorites.shopIds.length}
                </span>
              )}
            </Link>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 bg-white hover:border-rose-300 text-xs font-medium text-stone-700 shadow-sm transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="max-w-[100px] truncate sm:max-w-none">
                  {currentUser.role === "USER" && "Shopper Mode"}
                  {currentUser.role === "SHOP_OWNER" && "Shop Owner"}
                  {currentUser.role === "ADMIN" && "Admin"}
                </span>
              </button>

              {isRoleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsRoleMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Demo Role Switcher</p>
                    <p className="text-xs text-stone-600 font-medium">Switch persona to test full features:</p>
                  </div>

                  <div className="p-1 space-y-1">
                    {roles.map((item) => (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchRole(item.role);
                          setIsRoleMenuOpen(false);
                          if (item.role === "SHOP_OWNER") router.push("/shop-portal");
                          if (item.role === "ADMIN") router.push("/admin");
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-start gap-3 transition-colors ${
                          currentUser.role === item.role ? "bg-rose-50 border border-rose-200" : "hover:bg-stone-50"
                        }`}
                      >
                        <div className="p-1.5 bg-white rounded-lg shadow-xs mt-0.5">{item.icon}</div>
                        <div>
                          <p className="text-xs font-bold text-stone-900">{item.label}</p>
                          <p className="text-[11px] text-stone-500 leading-tight">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {currentUser.role === "SHOP_OWNER" && (
                    <div className="px-3 pt-2 border-t border-stone-100">
                      <Link
                        href="/shop-portal"
                        onClick={() => setIsRoleMenuOpen(false)}
                        className="block w-full py-1.5 text-center text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        Go to Shop Dashboard &rarr;
                      </Link>
                    </div>
                  )}

                  {currentUser.role === "ADMIN" && (
                    <div className="px-3 pt-2 border-t border-stone-100">
                      <Link
                        href="/admin"
                        onClick={() => setIsRoleMenuOpen(false)}
                        className="block w-full py-1.5 text-center text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-lg"
                      >
                        Go to Admin Dashboard &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200 space-y-3 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts (e.g. flowers under 5000)..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-100 rounded-xl text-sm border border-stone-200 text-stone-800"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2 text-sm font-medium">
              <Link
                href="/gifts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-stone-50 rounded-xl hover:bg-stone-100 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-rose-600" />
                Browse Gifts
              </Link>
              <Link
                href="/quiz"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-rose-50 rounded-xl text-rose-700 font-semibold flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-rose-600" />
                What to Buy?
              </Link>
              <Link
                href="/shops"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-stone-50 rounded-xl hover:bg-stone-100 flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-stone-600" />
                Shops
              </Link>
              <Link
                href="/recipients"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-stone-50 rounded-xl hover:bg-stone-100 flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-stone-600" />
                Recipients
              </Link>
              <Link
                href="/compare"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-stone-50 rounded-xl hover:bg-stone-100 flex items-center gap-2 col-span-2"
              >
                <Scale className="w-4 h-4 text-stone-600" />
                Compare Selected Gifts ({compareList.length})
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
