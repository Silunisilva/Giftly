import React from "react";
import Link from "next/link";
import { Sparkles, Heart, ExternalLink, ShieldCheck, Instagram, MessageCircle, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">
                Giftly<span className="text-rose-500">.</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Sri Lanka&apos;s premier gift discovery and shop aggregation engine. We help you answer <span className="text-white italic">&ldquo;What should I gift this person, and where can I find it?&rdquo;</span> with intelligent recommendations and direct seller connections.
            </p>
            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <span className="text-xs bg-stone-800 px-3 py-1.5 rounded-full border border-stone-700 flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Commission Discovery Engine
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/gifts" className="hover:text-rose-400 transition-colors">Browse All Gifts</Link></li>
              <li><Link href="/quiz" className="hover:text-rose-400 transition-colors font-medium text-rose-400">“What to Buy?” Quiz</Link></li>
              <li><Link href="/shops" className="hover:text-rose-400 transition-colors">Sri Lankan Shops Directory</Link></li>
              <li><Link href="/recipients" className="hover:text-rose-400 transition-colors">Saved Loved Ones</Link></li>
              <li><Link href="/compare" className="hover:text-rose-400 transition-colors">Compare Gifts</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Popular Hubs</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li><Link href="/gifts?category=Flowers+%26+Bouquets" className="hover:text-white transition-colors">Flowers & Bouquets</Link></li>
              <li><Link href="/gifts?category=Beauty+%26+Skincare" className="hover:text-white transition-colors">Luxury Ayurveda Skincare</Link></li>
              <li><Link href="/gifts?category=Curated+Gift+Boxes" className="hover:text-white transition-colors">Curated Gift Boxes</Link></li>
              <li><Link href="/gifts?category=Jewellery+%26+Keepsakes" className="hover:text-white transition-colors">Fine Ceylon Jewellery</Link></li>
              <li><Link href="/gifts?district=Colombo" className="hover:text-white transition-colors">Colombo Shops</Link></li>
            </ul>
          </div>

          {/* For Shop Owners */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">For Sellers</h4>
            <p className="text-xs text-stone-400 mb-3">
              Are you a Sri Lankan boutique, baker, florist, or artisan creator?
            </p>
            <Link
              href="/shop-portal"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 px-3 py-2 rounded-lg border border-rose-800/60 transition-colors"
            >
              List Your Shop Free
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Disclaimer & Transparency Bar */}
        <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="text-center md:text-left leading-relaxed">
            <strong className="text-stone-400">Platform Transparency Notice:</strong> Giftly is a gift discovery and shop aggregation platform, NOT an e-commerce store. Giftly does not process payments, checkout, orders, or delivery. Please confirm live pricing and product availability directly with the verified shop on WhatsApp, Instagram, or their website.
          </p>
          <div className="flex items-center gap-1 text-stone-400 flex-shrink-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Sri Lanka
          </div>
        </div>
      </div>
    </footer>
  );
}
