"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  Scale,
  Share2,
  CheckCircle,
  MapPin,
  MessageCircle,
  Instagram,
  Globe,
  Phone,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Store,
  Tag,
  Gift
} from "lucide-react";
import { Product } from "@/types";
import { formatLKR, trackOutboundClick } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import ProductCard from "@/components/ProductCard";
import DisclaimerBanner from "@/components/DisclaimerBanner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const { isProductFavorite, toggleFavoriteProduct, isInCompare, addToCompare, removeFromCompare } = useAuth();

  const [product, setProduct] = useState<(Product & { relatedGifts?: Product[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/gifts/${id}`);
        const json = await res.json();
        if (json.success) {
          setProduct(json.data);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-stone-500">Loading gift discovery profile...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Gift Listing Not Found</h2>
        <p className="text-sm text-stone-500">This gift might have been removed or updated by the seller.</p>
        <Link href="/gifts" className="inline-block px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl">
          &larr; Browse All Gifts
        </Link>
      </div>
    );
  }

  const isFav = isProductFavorite(product.id);
  const inCompare = isInCompare(product.id);
  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.imageUrl];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hi! I found your "${product.name}" (${formatLKR(product.price)}) on Giftly and would like to confirm availability and purchase options.`
  );
  const whatsappUrl = product.shop?.whatsappNumber
    ? `https://wa.me/${product.shop.whatsappNumber.replace(/[^0-9]/g, "")}?text=${whatsappText}`
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link href="/gifts" className="hover:text-stone-900">Gifts</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <Link href={`/gifts?category=${encodeURIComponent(product.category)}`} className="hover:text-stone-900">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <span className="text-stone-900 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-subtle">
            <Image
              src={images[activeImageIndex] || product.imageUrl}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-stone-900/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                Featured Selection ✨
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? "border-rose-600 ring-2 ring-rose-200" : "border-stone-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product & Shop Details (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Shop Header Badge */}
          {product.shop && (
            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
              <Link href={`/shops/${product.shop.slug}`} className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-stone-200 bg-white">
                  <Image src={product.shop.logo} alt={product.shop.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-stone-900 group-hover:text-rose-600 transition-colors">
                      {product.shop.name}
                    </span>
                    {product.shop.isVerified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {product.shop.address}, {product.shop.city}
                  </p>
                </div>
              </Link>

              <Link
                href={`/shops/${product.shop.slug}`}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-2xs"
              >
                View Shop
              </Link>
            </div>
          )}

          {/* Product Title & Reference Price */}
          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-extrabold text-stone-900">
                {formatLKR(product.price)}
              </span>
              <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                Seller Reference Price
              </span>
            </div>
          </div>

          {/* Action Bar: Direct Outbound Buttons (No Cart / Checkout!) */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Contact Verified Seller to Purchase:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp Button */}
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOutboundClick("OUTBOUND_WHATSAPP", product.shop!.id)}
                  className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-emerald-200 transition-transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Order via WhatsApp</span>
                </a>
              ) : (
                <button
                  disabled
                  className="py-3.5 px-4 bg-stone-200 text-stone-400 text-sm font-bold rounded-2xl cursor-not-allowed"
                >
                  WhatsApp Unavailable
                </button>
              )}

              {/* Instagram / Website Button */}
              {product.shop?.instagramUrl ? (
                <a
                  href={product.shop.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOutboundClick("OUTBOUND_INSTAGRAM", product.shop!.id, product.shop?.instagramUrl)}
                  className="py-3.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-95 text-white font-bold text-sm rounded-2xl shadow-md shadow-pink-200 transition-transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Message on Instagram</span>
                </a>
              ) : product.shop?.websiteUrl ? (
                <a
                  href={product.shop.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOutboundClick("OUTBOUND_WEBSITE", product.shop!.id, product.shop?.websiteUrl)}
                  className="py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-2xl shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Shop Website</span>
                </a>
              ) : null}
            </div>

            {/* Sub Actions: Favorite, Compare, Share */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => toggleFavoriteProduct(product.id)}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isFav
                    ? "bg-rose-50 border-rose-300 text-rose-700"
                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-600 text-rose-600" : ""}`} />
                <span>{isFav ? "Saved to Favorites" : "Save Gift"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (inCompare) removeFromCompare(product.id);
                  else addToCompare(product);
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  inCompare
                    ? "bg-stone-900 border-stone-900 text-white"
                    : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{inCompare ? "In Comparison (1/4)" : "Add to Compare"}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center justify-center"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            {copiedLink && (
              <p className="text-[11px] text-emerald-600 font-semibold text-center">
                Link copied to clipboard! 📋
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 pt-4 border-t border-stone-200">
            <h3 className="font-bold text-sm text-stone-900">About this Gift</h3>
            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Structured Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Category</span>
              <span className="text-xs font-bold text-stone-800">{product.category}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Gift Style</span>
              <span className="text-xs font-bold text-stone-800">{product.giftTypes.join(", ")}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Best Suited For</span>
              <span className="text-xs font-bold text-stone-800">{product.recipientTypes.slice(0, 2).join(", ")}</span>
            </div>
          </div>

          {/* Occasion Tags */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-stone-700 block">Recommended Occasions:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.occasions.map((occ) => (
                <Link
                  key={occ}
                  href={`/gifts?occasion=${encodeURIComponent(occ)}`}
                  className="text-xs bg-rose-50 text-rose-800 border border-rose-100 px-3 py-1 rounded-full font-medium hover:bg-rose-100 transition-colors"
                >
                  {occ}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Platform Disclaimer Alert */}
      <DisclaimerBanner />

      {/* Related Gifts from same category */}
      {product.relatedGifts && product.relatedGifts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-rose-600">You Might Also Love</span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">More in {product.category}</h2>
            </div>
            <Link
              href={`/gifts?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              View category &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedGifts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
