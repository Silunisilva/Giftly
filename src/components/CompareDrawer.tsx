"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Scale, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { formatLKR } from "@/lib/utils";

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useAuth();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-stone-900/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-stone-700 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Indicator */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-600 rounded-2xl flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold">Comparing Gifts</p>
            <p className="text-[11px] text-stone-400">{compareList.length} of 4 selected</p>
          </div>
        </div>

        {/* Center: Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {compareList.map((product) => (
            <div
              key={product.id}
              className="relative w-11 h-11 rounded-xl bg-stone-800 border border-stone-700 overflow-hidden flex-shrink-0 group"
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeFromCompare(product.id)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearCompare}
            className="text-[11px] text-stone-400 hover:text-white px-2 py-1 transition-colors"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-2xl transition-colors flex items-center gap-1.5 shadow-md shadow-rose-900/40"
          >
            Compare
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
