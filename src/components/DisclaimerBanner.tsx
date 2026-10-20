import React from "react";
import { Info, ExternalLink } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 my-6">
      <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-bold text-amber-950">
          Giftly is a gift discovery &amp; shop aggregation platform, NOT an e-commerce store.
        </p>
        <p className="text-amber-800 leading-relaxed">
          We do not process payments, checkout, shipping or orders. Prices and product availability are provided for reference and may change. Please contact the verified seller directly via WhatsApp, Instagram, or their website to confirm and complete your purchase.
        </p>
      </div>
    </div>
  );
}
