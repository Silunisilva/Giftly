import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompareDrawer from "@/components/CompareDrawer";

export const metadata: Metadata = {
  title: "Giftly | Find the Perfect Gift. From the Right Shop.",
  description: "Sri Lanka's premier AI gift discovery and shop aggregation platform. Tell us who you're shopping for, your budget, and what they love to discover authentic local gifts.",
  keywords: ["gift discovery", "sri lanka gifts", "colombo flower delivery", "gift boxes sri lanka", "birthday gifts lkr", "giftly"],
  openGraph: {
    title: "Giftly | Curated Gift Discovery & Sri Lankan Shop Aggregation",
    description: "Discover the perfect gift from authentic Sri Lankan shops, florists, bakeries, and creators without endlessly scrolling Instagram.",
    url: "https://giftly.lk",
    siteName: "Giftly",
    locale: "en_LK",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 antialiased selection:bg-rose-100 selection:text-rose-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <CompareDrawer />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
