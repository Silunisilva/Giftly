"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Scale, X, ExternalLink, MessageCircle, Instagram, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { formatLKR, trackOutboundClick } from "@/lib/utils";
import DisclaimerBanner from "@/components/DisclaimerBanner";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-rose-600">Decision Helper</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Compare Gifts Side-by-Side
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Compare pricing, shop contact channels, gift styles, and recipient compatibility to make the best choice.
          </p>
        </div>

        {compareList.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-stone-500 hover:text-rose-600 font-bold"
            >
              Clear Comparison
            </button>
            <Link
              href="/gifts"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <span>+ Add More Gifts</span>
            </Link>
          </div>
        )}
      </div>

      {/* Comparison Table / Matrix */}
      {compareList.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-3xl border border-stone-200/80 shadow-subtle p-6">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="p-4 w-44 text-xs font-extrabold text-stone-400 uppercase tracking-wider">Features</th>
                {compareList.map((product) => (
                  <th key={product.id} className="p-4 w-64 align-top relative">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-2 right-2 p-1.5 bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 rounded-full transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-3 pr-6">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      </div>
                      <Link href={`/gifts/${product.id}`} className="font-bold text-sm text-stone-900 hover:text-rose-600 block line-clamp-2">
                        {product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-xs">
              {/* Reference Price */}
              <tr>
                <td className="p-4 font-bold text-stone-500">Price (LKR)</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <span className="text-base font-extrabold text-stone-900">{formatLKR(p.price)}</span>
                  </td>
                ))}
              </tr>

              {/* Shop & Location */}
              <tr>
                <td className="p-4 font-bold text-stone-500">Seller & City</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 space-y-1">
                    {p.shop && (
                      <Link href={`/shops/${p.shop.slug}`} className="font-bold text-stone-800 hover:text-rose-600 flex items-center gap-1">
                        <span>{p.shop.name}</span>
                        {p.shop.isVerified && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                      </Link>
                    )}
                    <span className="text-stone-400 block">{p.shop?.city} ({p.shop?.district})</span>
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr>
                <td className="p-4 font-bold text-stone-500">Category</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-stone-800">
                    {p.category}
                  </td>
                ))}
              </tr>

              {/* Gift Style */}
              <tr>
                <td className="p-4 font-bold text-stone-500">Gift Vibe</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 font-medium text-stone-700">
                    {p.giftTypes.join(", ")}
                  </td>
                ))}
              </tr>

              {/* Best For */}
              <tr>
                <td className="p-4 font-bold text-stone-500">Best Suited For</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.recipientTypes.map(r => (
                        <span key={r} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Occasions */}
              <tr>
                <td className="p-4 font-bold text-stone-500">Occasions</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.occasions.map(o => (
                        <span key={o} className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md text-[11px] font-medium">
                          {o}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Outbound Contact CTA */}
              <tr>
                <td className="p-4 font-bold text-stone-500">Direct Contact</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 space-y-2">
                    {p.shop?.whatsappNumber && (
                      <a
                        href={`https://wa.me/${p.shop.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi! I found your "${p.name}" on Giftly.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackOutboundClick("OUTBOUND_WHATSAPP", p.shop!.id)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <Link
                      href={`/gifts/${p.id}`}
                      className="w-full py-2 bg-stone-900 hover:bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors block text-center"
                    >
                      <span>View Details</span>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 max-w-md mx-auto space-y-4 shadow-subtle">
          <div className="w-14 h-14 bg-stone-100 text-stone-700 rounded-full flex items-center justify-center mx-auto">
            <Scale className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">No Gifts Selected for Comparison</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Click the scale icon on any product card while exploring gifts to compare their price, shop, and features here!
          </p>
          <Link
            href="/gifts"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            <span>Explore Gifts to Compare</span>
          </Link>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}
