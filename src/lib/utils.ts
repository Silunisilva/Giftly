import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLKR(amount: number): string {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

export async function trackOutboundClick(
  eventType: "OUTBOUND_WHATSAPP" | "OUTBOUND_INSTAGRAM" | "OUTBOUND_WEBSITE",
  entityId: string,
  url?: string
) {
  try {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        entityId,
        entityType: "shop",
        metadata: { targetUrl: url },
      }),
    }).catch(() => {});
  } catch {}
}
