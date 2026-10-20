"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, MapPin, Globe, Instagram, MessageCircle, Heart } from "lucide-react";
import { Shop } from "@/types";
import { useAuth } from "@/lib/auth/auth-context";
import { trackOutboundClick } from "@/lib/utils";

interface ShopCardProps {
  shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
  const { isShopFavorite, toggleFavoriteShop } = useAuth();
  const isFav = isShopFavorite(shop.id);

  return (
    <div className="group relative bg-white rounded-3xl border border-stone-200/80 hover:border-rose-300 shadow-subtle gift-card-hover overflow-hidden flex flex-col justify-between transition-all">
      {/* Cover Image */}
      <div className="relative h-32 w-full bg-stone-100 overflow-hidden">
        <Image
          src={shop.coverImage}
          alt={shop.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent"></div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavoriteShop(shop.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFav
              ? "bg-rose-600 text-white"
              : "bg-white/80 text-stone-700 hover:bg-white hover:text-rose-600"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Shop Info Container */}
      <div className="px-5 pb-5 pt-0 flex-1 flex flex-col justify-between relative">
        {/* Floating Logo */}
        <div className="relative -mt-9 mb-3 flex items-end justify-between">
          <div className="relative w-16 h-16 rounded-2xl border-2 border-white bg-white shadow-md overflow-hidden flex-shrink-0">
            <Image
              src={shop.logo}
              alt={shop.name}
              fill
              className="object-cover"
            />
          </div>
          {shop.isVerified && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full mb-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              Verified Shop
            </span>
          )}
        </div>

        <div>
          {/* Shop Title */}
          <Link href={`/shops/${shop.slug}`} className="block group-hover:text-rose-600 transition-colors">
            <h3 className="font-bold text-lg text-stone-900 line-clamp-1">{shop.name}</h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>{shop.address}, {shop.city} ({shop.district})</span>
          </div>

          {/* Tagline / Description */}
          <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
            {shop.tagLine || shop.description}
          </p>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {shop.categories.slice(0, 3).map((cat) => (
              <span key={cat} className="text-[10px] bg-stone-100 text-stone-600 font-medium px-2 py-0.5 rounded-md">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {shop.whatsappNumber && (
              <a
                href={`https://wa.me/${shop.whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick("OUTBOUND_WHATSAPP", shop.id)}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors"
                title="Message on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}

            {shop.instagramUrl && (
              <a
                href={shop.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick("OUTBOUND_INSTAGRAM", shop.id, shop.instagramUrl)}
                className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl transition-colors"
                title="View Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}

            {shop.websiteUrl && (
              <a
                href={shop.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick("OUTBOUND_WEBSITE", shop.id, shop.websiteUrl)}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                title="Visit Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>

          <Link
            href={`/shops/${shop.slug}`}
            className="px-4 py-2 bg-stone-900 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            View Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
