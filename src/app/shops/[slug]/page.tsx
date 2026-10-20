"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  MapPin,
  MessageCircle,
  Instagram,
  Globe,
  Phone,
  Mail,
  Heart,
  Store,
  ChevronRight,
  Sparkles,
  Facebook
} from "lucide-react";
import { Shop, Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { useAuth } from "@/lib/auth/auth-context";
import { trackOutboundClick } from "@/lib/utils";

export default function SingleShopPage() {
  const params = useParams();
  const { slug } = params as { slug: string };
  const { isShopFavorite, toggleFavoriteShop } = useAuth();

  const [shop, setShop] = useState<(Shop & { products?: Product[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShop() {
      setLoading(true);
      try {
        const res = await fetch(`/api/shops/${slug}`);
        const json = await res.json();
        if (json.success) {
          setShop(json.data);
        }
      } catch (err) {
        console.error("Error loading shop:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadShop();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-stone-500">Loading shop profile...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Shop Not Found</h2>
        <p className="text-sm text-stone-500">The shop you are looking for may have been moved or updated.</p>
        <Link href="/shops" className="inline-block px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl">
          &larr; Browse All Shops
        </Link>
      </div>
    );
  }

  const isFav = isShopFavorite(shop.id);

  return (
    <div className="space-y-10 pb-16">
      {/* Cover Header Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-stone-900 overflow-hidden">
        <Image
          src={shop.coverImage}
          alt={shop.name}
          fill
          priority
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>

        {/* Back navigation */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            href="/shops"
            className="px-3.5 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            &larr; All Shops
          </Link>
        </div>
      </div>

      {/* Shop Profile Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 sm:-mt-28 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            {/* Logo & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-white bg-white shadow-lg flex-shrink-0">
                <Image src={shop.logo} alt={shop.name} fill className="object-cover" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    {shop.name}
                  </h1>
                  {shop.isVerified && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Seller
                    </span>
                  )}
                </div>

                {shop.tagLine && (
                  <p className="text-xs sm:text-sm font-semibold text-rose-600">
                    {shop.tagLine}
                  </p>
                )}

                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{shop.address}, {shop.city} ({shop.district} District)</span>
                </div>
              </div>
            </div>

            {/* Favorite & Share Buttons */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => toggleFavoriteShop(shop.id)}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isFav
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-rose-600 text-rose-600" : ""}`} />
                <span>{isFav ? "Saved Shop" : "Save Shop"}</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-stone-600 text-sm leading-relaxed max-w-3xl">
            {shop.description}
          </p>

          {/* Outbound Social & Contact Channels */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block sm:inline">
              Contact Channels:
            </span>

            {shop.whatsappNumber && (
              <a
                href={`https://wa.me/${shop.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi! I found your shop on Giftly.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick("OUTBOUND_WHATSAPP", shop.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                <span>WhatsApp: {shop.whatsappNumber}</span>
              </a>
            )}

            {shop.instagramUrl && (
              <a
                href={shop.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick("OUTBOUND_INSTAGRAM", shop.id, shop.instagramUrl)}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram Profile</span>
              </a>
            )}

            {shop.websiteUrl && (
              <a
                href={shop.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick("OUTBOUND_WEBSITE", shop.id, shop.websiteUrl)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit Official Website</span>
              </a>
            )}

            {shop.phone && (
              <a
                href={`tel:${shop.phone}`}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>{shop.phone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Shop's Products Collection */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Available Catalog</span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Gifts from {shop.name} ({shop.products?.length || 0})
              </h2>
            </div>
          </div>

          {shop.products && shop.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shop.products.map(product => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, shop }}
                  showShopSnippet={false}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-xs text-stone-500">
              No products currently listed for this shop.
            </div>
          )}
        </section>

        <DisclaimerBanner />
      </div>
    </div>
  );
}
