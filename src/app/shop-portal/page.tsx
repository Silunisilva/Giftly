"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Store,
  Plus,
  Eye,
  MousePointerClick,
  MessageCircle,
  Instagram,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  Sparkles,
  Info,
  X
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { Shop, Product } from "@/types";
import { formatLKR } from "@/lib/utils";

export default function ShopPortalPage() {
  const { currentUser, switchRole } = useAuth();
  const [shop, setShop] = useState<(Shop & { products?: Product[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // New Product Form State
  const [prodName, setProdName] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodPrice, setProdPrice] = useState(4500);
  const [prodCategory, setProdCategory] = useState("Flowers & Bouquets");
  const [prodImage, setProdImage] = useState("https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80");
  const [prodOccasions, setProdOccasions] = useState("Birthday, Anniversary");
  const [prodRecipients, setProdRecipients] = useState("Girlfriend, Mom");
  const [prodInterests, setProdInterests] = useState("Flowers, Cute decor");
  const [prodGiftTypes, setProdGiftTypes] = useState("Romantic, Cute");

  // Shop Profile Edit State
  const [shopName, setShopName] = useState("");
  const [shopTagline, setShopTagline] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopWhatsapp, setShopWhatsapp] = useState("");
  const [shopInstagram, setShopInstagram] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadShopData = async () => {
    setLoading(true);
    try {
      // Bloom House is our default shop-owner demo shop
      const res = await fetch("/api/shops/bloom-house");
      const json = await res.json();
      if (json.success) {
        setShop(json.data);
        setShopName(json.data.name);
        setShopTagline(json.data.tagLine || "");
        setShopAddress(json.data.address);
        setShopWhatsapp(json.data.whatsappNumber || "");
        setShopInstagram(json.data.instagramUrl || "");
      }
    } catch (err) {
      console.error("Error loading shop data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShopData();
  }, []);

  const handleUpdateShopProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;

    try {
      const res = await fetch(`/api/shops/${shop.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: shopName,
          tagLine: shopTagline,
          address: shopAddress,
          whatsappNumber: shopWhatsapp,
          instagramUrl: shopInstagram,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        loadShopData();
      }
    } catch (err) {
      console.error("Error updating shop profile:", err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop || !prodName || !prodPrice) return;

    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: shop.id,
          name: prodName,
          description: prodDescription,
          price: prodPrice,
          category: prodCategory,
          imageUrl: prodImage,
          occasions: prodOccasions.split(",").map(s => s.trim()),
          recipientTypes: prodRecipients.split(",").map(s => s.trim()),
          interests: prodInterests.split(",").map(s => s.trim()),
          giftTypes: prodGiftTypes.split(",").map(s => s.trim()),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsAddProductModalOpen(false);
        setProdName("");
        setProdDescription("");
        loadShopData();
      }
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this discovery listing?")) return;
    try {
      const res = await fetch(`/api/gifts/${productId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        loadShopData();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-100">
            <Store className="w-3.5 h-3.5" />
            <span>Seller Management Portal</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Shop Discovery Dashboard
          </h1>
          <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
            Manage your shop&apos;s visibility on Giftly. Users discover your products here and click directly to your WhatsApp, Instagram, and website to make purchases.
          </p>
        </div>

        {currentUser.role !== "SHOP_OWNER" && (
          <button
            onClick={() => switchRole("SHOP_OWNER")}
            className="px-4 py-2 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow-sm self-start sm:self-auto hover:bg-emerald-50 transition-colors"
          >
            Switch to Shop Owner Persona
          </button>
        )}
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase">Total Listed Gifts</span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{shop?.products?.length || 0}</p>
          <span className="text-[11px] text-stone-500 font-medium">Active discovery listings</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase">Discovery Views</span>
            <Eye className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900">
            {shop?.products?.reduce((acc, p) => acc + (p.viewsCount || 0), 0) || 817}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold">&uarr; 24% this week</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase">WhatsApp Leads</span>
            <MessageCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900">142</p>
          <span className="text-[11px] text-stone-500">Direct outbound inquiries</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase">Instagram Clicks</span>
            <Instagram className="w-4 h-4 text-pink-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900">98</p>
          <span className="text-[11px] text-stone-500">Profile visits</span>
        </div>
      </div>

      {/* Main Grid: Products Manager + Shop Profile Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products Management (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Your Listed Gifts ({shop?.products?.length || 0})
            </h2>
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="px-4 py-2 bg-stone-900 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Gift</span>
            </button>
          </div>

          {shop?.products && shop.products.length > 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-subtle divide-y divide-stone-100 overflow-hidden">
              {shop.products.map((product) => (
                <div key={product.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/gifts/${product.id}`} className="font-bold text-sm text-stone-900 hover:text-rose-600 truncate block">
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <span className="font-extrabold text-stone-900">{formatLKR(product.price)}</span>
                        <span>&bull;</span>
                        <span>{product.category}</span>
                        <span>&bull;</span>
                        <span>{product.viewsCount} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/gifts/${product.id}`}
                      className="p-2 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 text-xs font-semibold"
                    >
                      Preview
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs">
              No products listed yet. Click &ldquo;Add New Gift&rdquo; to start getting discovered!
            </div>
          )}
        </div>

        {/* Shop Settings Card (1 col) */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-900">Shop Profile Details</h2>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-subtle space-y-4 text-xs">
            <form onSubmit={handleUpdateShopProfile} className="space-y-3.5">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Shop Name</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Tagline / Specialty</label>
                <input
                  type="text"
                  value={shopTagline}
                  onChange={(e) => setShopTagline(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Store Address</label>
                <input
                  type="text"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">WhatsApp Business Number</label>
                <input
                  type="text"
                  value={shopWhatsapp}
                  onChange={(e) => setShopWhatsapp(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Instagram Link</label>
                <input
                  type="text"
                  value={shopInstagram}
                  onChange={(e) => setShopInstagram(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Updates</span>
              </button>

              {savedSuccess && (
                <p className="text-emerald-600 font-bold text-center">
                  Shop details updated successfully!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-xl text-stone-900">Add New Gift Listing</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Preserved Peony & Hydrangea Box"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Price (LKR) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                  >
                    <option value="Flowers & Bouquets">Flowers & Bouquets</option>
                    <option value="Beauty & Skincare">Beauty & Skincare</option>
                    <option value="Curated Gift Boxes">Curated Gift Boxes</option>
                    <option value="Cakes & Desserts">Cakes & Desserts</option>
                    <option value="Chocolates & Sweets">Chocolates & Sweets</option>
                    <option value="Jewellery & Keepsakes">Jewellery & Keepsakes</option>
                    <option value="Home & Lifestyle">Home & Lifestyle</option>
                    <option value="Perfumes & Scents">Perfumes & Scents</option>
                    <option value="Plants & Succulents">Plants & Succulents</option>
                    <option value="Stationery & Books">Stationery & Books</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Describe materials, packaging, customization options..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Occasions (Comma separated)</label>
                  <input
                    type="text"
                    value={prodOccasions}
                    onChange={(e) => setProdOccasions(e.target.value)}
                    placeholder="Birthday, Anniversary"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Recipients (Comma separated)</label>
                  <input
                    type="text"
                    value={prodRecipients}
                    onChange={(e) => setProdRecipients(e.target.value)}
                    placeholder="Girlfriend, Mom, Sister"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 text-stone-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Publish Discovery Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
