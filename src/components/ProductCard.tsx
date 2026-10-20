"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Scale,
  Sparkles,
  ExternalLink,
  Store,
  MessageCircle,
  Instagram,
  CheckCircle,
  Tag
} from "lucide-react";
import { Product } from "@/types";
import { formatLKR, trackOutboundClick } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";

interface ProductCardProps {
  product: Product;
  matchScore?: number;
  matchReason?: string;
  showShopSnippet?: boolean;
}

export default function ProductCard({
  product,
  matchScore,
  matchReason,
  showShopSnippet = true,
}: ProductCardProps) {
  const { isProductFavorite, toggleFavoriteProduct, isInCompare, addToCompare, removeFromCompare } = useAuth();
  const [imageError, setImageError] = useState(false);
  const isFav = isProductFavorite(product.id);
  const inCompare = isInCompare(product.id);

  const fallbackImage = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="group relative bg-white rounded-3xl border border-stone-200/80 hover:border-rose-300/80 shadow-subtle gift-card-hover overflow-hidden flex flex-col justify-between transition-all">
      {/* Top Media Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <Link href={`/gifts/${product.id}`} className="block w-full h-full">
          <Image
            src={imageError ? fallbackImage : product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
          />
        </Link>

        {/* Match Score Badge (if present from AI or recommendations) */}
        {matchScore !== undefined && matchScore > 0 && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-rose-100 shadow-sm flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            <span className="text-xs font-extrabold text-rose-600">{matchScore}% Match</span>
          </div>
        )}

        {/* Featured Badge */}
        {product.isFeatured && matchScore === undefined && (
          <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide flex items-center gap-1 shadow-sm">
            <span>Staff Pick ✨</span>
          </div>
        )}

        {/* Top Right Action Pills (Favorite & Compare) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleFavoriteProduct(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isFav
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "bg-white/90 text-stone-700 hover:bg-white hover:text-rose-600"
            }`}
            title={isFav ? "Remove from favorites" : "Save to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (inCompare) {
                removeFromCompare(product.id);
              } else {
                addToCompare(product);
              }
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              inCompare
                ? "bg-stone-900 text-white"
                : "bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900"
            }`}
            title={inCompare ? "Remove from comparison" : "Add to comparison"}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pill Over Image */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-stone-900/75 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Shop Reference with Verified Tick */}
          {showShopSnippet && product.shop && (
            <div className="flex items-center justify-between mb-2">
              <Link
                href={`/shops/${product.shop.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-rose-600 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-stone-400" />
                <span className="truncate max-w-[150px]">{product.shop.name}</span>
                {product.shop.isVerified && (
                  <CheckCircle className="w-3 h-3 text-emerald-500 fill-emerald-100" />
                )}
              </Link>
              <span className="text-[11px] text-stone-400">{product.shop.city}</span>
            </div>
          )}

          {/* Product Title */}
          <Link href={`/gifts/${product.id}`} className="block group-hover:text-rose-600 transition-colors">
            <h3 className="font-bold text-base text-stone-900 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-stone-500 text-xs line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>

          {/* "Why it matches" box if available */}
          {matchReason && (
            <div className="mt-3 p-2 bg-rose-50/70 border border-rose-100 rounded-xl text-[11px] text-rose-900 font-medium flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{matchReason}</span>
            </div>
          )}

          {/* Tags preview */}
          <div className="flex flex-wrap gap-1 mt-3">
            {product.recipientTypes.slice(0, 2).map((rec) => (
              <span key={rec} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                For {rec}
              </span>
            ))}
            {product.occasions.slice(0, 1).map((occ) => (
              <span key={occ} className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                {occ}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Card Footer: Price & View CTA */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-stone-400 block font-medium uppercase">Reference Price</span>
            <span className="text-base font-extrabold text-stone-900">
              {formatLKR(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Contact Icons if available */}
            {product.shop?.whatsappNumber && (
              <a
                href={`https://wa.me/${product.shop.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi! I found your "${product.name}" on Giftly and would like to ask about availability.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundClick("OUTBOUND_WHATSAPP", product.shop!.id)}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors"
                title="Message shop on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}

            <Link
              href={`/gifts/${product.id}`}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
