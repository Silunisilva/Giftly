"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, Product, RecipientProfile } from "@/types";

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  favorites: { productIds: string[]; shopIds: string[] };
  toggleFavoriteProduct: (productId: string) => Promise<boolean>;
  toggleFavoriteShop: (shopId: string) => Promise<boolean>;
  isProductFavorite: (productId: string) => boolean;
  isShopFavorite: (shopId: string) => boolean;
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const DEMO_USERS: Record<UserRole, User> = {
  USER: {
    id: "user-shopper",
    name: "Siluni Silva",
    email: "siluni@example.com",
    role: "USER",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-15T08:00:00.000Z",
    updatedAt: "2026-01-15T08:00:00.000Z",
  },
  SHOP_OWNER: {
    id: "user-shopowner",
    name: "Kasun Jayawardena (Bloom House)",
    email: "partner@bloomhouse.lk",
    role: "SHOP_OWNER",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z",
  },
  ADMIN: {
    id: "user-admin",
    name: "Giftly Administrator",
    email: "admin@giftly.lk",
    role: "ADMIN",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS.USER);
  const [favorites, setFavorites] = useState<{ productIds: string[]; shopIds: string[] }>({
    productIds: ["prod-rose-bouquet", "prod-mimosa-sweet-hug"],
    shopIds: ["shop-bloom-house"]
  });
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Load from local storage if available
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("giftly_active_role") as UserRole | null;
      if (savedRole && DEMO_USERS[savedRole]) {
        setCurrentUser(DEMO_USERS[savedRole]);
      }

      const savedFavs = localStorage.getItem("giftly_favorites");
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }

      const savedCompare = localStorage.getItem("giftly_compare");
      if (savedCompare) {
        setCompareList(JSON.parse(savedCompare));
      }
    } catch {}
  }, []);

  const switchRole = (role: UserRole) => {
    const newUser = DEMO_USERS[role];
    setCurrentUser(newUser);
    try {
      localStorage.setItem("giftly_active_role", role);
    } catch {}
  };

  const toggleFavoriteProduct = async (productId: string): Promise<boolean> => {
    let nextAdded = false;
    setFavorites(prev => {
      const exists = prev.productIds.includes(productId);
      nextAdded = !exists;
      const updated = {
        ...prev,
        productIds: exists ? prev.productIds.filter(id => id !== productId) : [...prev.productIds, productId]
      };
      try {
        localStorage.setItem("giftly_favorites", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Sync with backend API in background
    fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, productId }),
    }).catch(() => {});

    return nextAdded;
  };

  const toggleFavoriteShop = async (shopId: string): Promise<boolean> => {
    let nextAdded = false;
    setFavorites(prev => {
      const exists = prev.shopIds.includes(shopId);
      nextAdded = !exists;
      const updated = {
        ...prev,
        shopIds: exists ? prev.shopIds.filter(id => id !== shopId) : [...prev.shopIds, shopId]
      };
      try {
        localStorage.setItem("giftly_favorites", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, shopId }),
    }).catch(() => {});

    return nextAdded;
  };

  const isProductFavorite = (productId: string) => favorites.productIds.includes(productId);
  const isShopFavorite = (shopId: string) => favorites.shopIds.includes(shopId);

  const addToCompare = (product: Product) => {
    if (compareList.length >= 4) {
      alert("You can compare up to 4 gifts at a time.");
      return;
    }
    if (!compareList.some(p => p.id === product.id)) {
      const updated = [...compareList, product];
      setCompareList(updated);
      try {
        localStorage.setItem("giftly_compare", JSON.stringify(updated));
      } catch {}
    }
  };

  const removeFromCompare = (productId: string) => {
    const updated = compareList.filter(p => p.id !== productId);
    setCompareList(updated);
    try {
      localStorage.setItem("giftly_compare", JSON.stringify(updated));
    } catch {}
  };

  const clearCompare = () => {
    setCompareList([]);
    try {
      localStorage.removeItem("giftly_compare");
    } catch {}
  };

  const isInCompare = (productId: string) => compareList.some(p => p.id === productId);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        favorites,
        toggleFavoriteProduct,
        toggleFavoriteShop,
        isProductFavorite,
        isShopFavorite,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
