export type UserRole = "USER" | "SHOP_OWNER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  tagLine?: string;
  description: string;
  logo: string;
  coverImage: string;
  websiteUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  whatsappNumber?: string;
  phone?: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  latitude?: number;
  longitude?: number;
  categories: string[];
  isVerified: boolean;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  shopId: string;
  shop?: Shop;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  galleryImages?: string[];
  productUrl?: string;
  category: string;
  tags: string[];
  occasions: string[];
  recipientTypes: string[];
  interests: string[];
  giftTypes: string[]; // e.g. "Romantic", "Useful", "Cute", "Luxurious", "Personalized", "Surprising"
  minBudget?: number;
  maxBudget?: number;
  isFeatured?: boolean;
  isActive: boolean;
  viewsCount: number;
  clicksCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipientProfile {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  ageGroup?: string;
  interests: string[];
  preferredStyles: string[];
  minBudget?: number;
  maxBudget?: number;
  birthday?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  productId?: string;
  product?: Product;
  shopId?: string;
  shop?: Shop;
  createdAt: string;
}

export interface SavedList {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic: boolean;
  itemIds: string[];
  items?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface Occasion {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  sortOrder: number;
}

export interface AnalyticsEvent {
  id: string;
  eventType: "PRODUCT_VIEW" | "SHOP_VIEW" | "OUTBOUND_WEBSITE" | "OUTBOUND_INSTAGRAM" | "OUTBOUND_WHATSAPP" | "SEARCH_QUERY" | "AI_SEARCH";
  entityId?: string;
  entityType?: "product" | "shop";
  query?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface RecommendationMatch {
  product: Product;
  score: number; // 0 - 100%
  breakdown: {
    budget: number;
    occasion: number;
    recipient: number;
    interest: number;
    category: number;
  };
  reasons: string[];
}

export interface GiftSearchParams {
  query?: string;
  recipient?: string;
  occasion?: string;
  category?: string;
  giftType?: string;
  minPrice?: number;
  maxPrice?: number;
  shopSlug?: string;
  district?: string;
  city?: string;
  sort?: "recommended" | "price_asc" | "price_desc" | "popular" | "newest";
  limit?: number;
  page?: number;
}
