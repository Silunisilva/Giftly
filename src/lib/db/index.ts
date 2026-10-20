import fs from "fs";
import path from "path";
import {
  Shop,
  Product,
  User,
  RecipientProfile,
  Favorite,
  SavedList,
  AnalyticsEvent,
  Category,
  Occasion,
  GiftSearchParams
} from "@/types";
import {
  INITIAL_CATEGORIES,
  INITIAL_OCCASIONS,
  INITIAL_USERS,
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_RECIPIENT_PROFILES
} from "@/lib/data/seed-data";

interface DatabaseSchema {
  categories: Category[];
  occasions: Occasion[];
  users: User[];
  shops: Shop[];
  products: Product[];
  recipientProfiles: RecipientProfile[];
  favorites: Favorite[];
  savedLists: SavedList[];
  analyticsEvents: AnalyticsEvent[];
}

const DB_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DB_DIR, "db.json");

// In-memory fallback / cache
let memoryDb: DatabaseSchema | null = null;

function ensureDataDir(): boolean {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    return true;
  } catch (err) {
    console.warn("Could not create local .data directory, running in memory-mode:", err);
    return false;
  }
}

function getInitialDb(): DatabaseSchema {
  return {
    categories: [...INITIAL_CATEGORIES],
    occasions: [...INITIAL_OCCASIONS],
    users: [...INITIAL_USERS],
    shops: [...INITIAL_SHOPS],
    products: [...INITIAL_PRODUCTS],
    recipientProfiles: [...INITIAL_RECIPIENT_PROFILES],
    favorites: [
      {
        id: "fav-1",
        userId: "user-shopper",
        productId: "prod-rose-bouquet",
        createdAt: "2026-01-16T10:00:00.000Z"
      },
      {
        id: "fav-2",
        userId: "user-shopper",
        productId: "prod-mimosa-sweet-hug",
        createdAt: "2026-01-16T10:00:00.000Z"
      },
      {
        id: "fav-3",
        userId: "user-shopper",
        shopId: "shop-bloom-house",
        createdAt: "2026-01-16T10:00:00.000Z"
      }
    ],
    savedLists: [
      {
        id: "list-girlfriend-bday",
        userId: "user-shopper",
        title: "Girlfriend Birthday Ideas 🎂",
        description: "Curated gift shortlist for May birthday surprise",
        isPublic: true,
        itemIds: ["prod-rose-bouquet", "prod-mimosa-sweet-hug", "prod-aurelia-initial-disc"],
        createdAt: "2026-01-16T10:00:00.000Z",
        updatedAt: "2026-01-16T10:00:00.000Z",
      }
    ],
    analyticsEvents: [
      {
        id: "evt-1",
        eventType: "SEARCH_QUERY",
        query: "birthday gift for girlfriend under 5000",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: "evt-2",
        eventType: "PRODUCT_VIEW",
        entityId: "prod-rose-bouquet",
        entityType: "product",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: "evt-3",
        eventType: "OUTBOUND_WHATSAPP",
        entityId: "shop-bloom-house",
        entityType: "shop",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: "evt-4",
        eventType: "OUTBOUND_INSTAGRAM",
        entityId: "shop-spa-ceylon",
        entityType: "shop",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "evt-5",
        eventType: "OUTBOUND_WEBSITE",
        entityId: "shop-mimosa",
        entityType: "shop",
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ]
  };
}

export function getDb(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      memoryDb = JSON.parse(data);
      return memoryDb!;
    }
  } catch (err) {
    console.warn("Could not read db file, loading seed defaults:", err);
  }

  memoryDb = getInitialDb();
  saveDb(memoryDb);
  return memoryDb;
}

export function saveDb(db: DatabaseSchema): void {
  memoryDb = db;
  try {
    if (ensureDataDir()) {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Could not persist db to disk, kept in memory:", err);
  }
}

// ---------------------------
// Typed Pure Node Data Layer
// ---------------------------

export const db = {
  // Shops
  getShops(filter?: { category?: string; city?: string; district?: string; isVerified?: boolean; status?: string }): Shop[] {
    const data = getDb();
    let result = [...data.shops];

    if (filter?.status) {
      result = result.filter(s => s.status === filter.status);
    } else {
      result = result.filter(s => s.status === "ACTIVE");
    }

    if (filter?.category) {
      const catLower = filter.category.toLowerCase();
      result = result.filter(s => s.categories.some(c => c.toLowerCase().includes(catLower)));
    }

    if (filter?.city) {
      result = result.filter(s => s.city.toLowerCase().includes(filter.city!.toLowerCase()));
    }

    if (filter?.district) {
      result = result.filter(s => s.district.toLowerCase() === filter.district!.toLowerCase());
    }

    if (filter?.isVerified !== undefined) {
      result = result.filter(s => s.isVerified === filter.isVerified);
    }

    return result;
  },

  getShopBySlug(slug: string): Shop | null {
    const data = getDb();
    return data.shops.find(s => s.slug === slug || s.id === slug) || null;
  },

  getShopById(id: string): Shop | null {
    const data = getDb();
    return data.shops.find(s => s.id === id) || null;
  },

  createShop(shopData: Omit<Shop, "id" | "createdAt" | "updatedAt">): Shop {
    const data = getDb();
    const newShop: Shop = {
      ...shopData,
      id: `shop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.shops.push(newShop);
    saveDb(data);
    return newShop;
  },

  updateShop(id: string, updates: Partial<Shop>): Shop | null {
    const data = getDb();
    const index = data.shops.findIndex(s => s.id === id);
    if (index === -1) return null;

    data.shops[index] = {
      ...data.shops[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDb(data);
    return data.shops[index];
  },

  // Products
  getProducts(params?: GiftSearchParams): { products: Product[]; total: number } {
    const data = getDb();
    const shopMap = new Map(data.shops.map(s => [s.id, s]));

    let results = data.products
      .filter(p => p.isActive)
      .map(p => ({
        ...p,
        shop: shopMap.get(p.shopId)
      }));

    if (params?.shopSlug) {
      const targetShop = data.shops.find(s => s.slug === params.shopSlug || s.id === params.shopSlug);
      if (targetShop) {
        results = results.filter(p => p.shopId === targetShop.id);
      }
    }

    if (params?.category) {
      const cat = params.category.toLowerCase();
      results = results.filter(p => p.category.toLowerCase().includes(cat));
    }

    if (params?.occasion) {
      const occ = params.occasion.toLowerCase();
      results = results.filter(p => p.occasions.some(o => o.toLowerCase().includes(occ)));
    }

    if (params?.recipient) {
      const rec = params.recipient.toLowerCase();
      results = results.filter(p => p.recipientTypes.some(r => r.toLowerCase().includes(rec)));
    }

    if (params?.giftType) {
      const gt = params.giftType.toLowerCase();
      results = results.filter(p => p.giftTypes.some(g => g.toLowerCase().includes(gt)));
    }

    if (params?.minPrice !== undefined) {
      results = results.filter(p => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      results = results.filter(p => p.price <= params.maxPrice!);
    }

    if (params?.district) {
      results = results.filter(p => p.shop?.district.toLowerCase() === params.district!.toLowerCase());
    }

    if (params?.query) {
      const q = params.query.toLowerCase().trim();
      const terms = q.split(/\s+/).filter(Boolean);

      results = results.filter(p => {
        const fullText = [
          p.name,
          p.description,
          p.category,
          p.tags.join(" "),
          p.occasions.join(" "),
          p.recipientTypes.join(" "),
          p.interests.join(" "),
          p.shop?.name || "",
          p.shop?.city || ""
        ].join(" ").toLowerCase();

        return terms.some(t => fullText.includes(t));
      });
    }

    // Sorting
    if (params?.sort === "price_asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (params?.sort === "price_desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (params?.sort === "popular") {
      results.sort((a, b) => (b.viewsCount + b.clicksCount * 2) - (a.viewsCount + a.clicksCount * 2));
    } else if (params?.sort === "newest") {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Recommended default: featured first, then popularity
      results.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.viewsCount + b.clicksCount * 2) - (a.viewsCount + a.clicksCount * 2);
      });
    }

    const total = results.length;
    const limit = params?.limit || 50;
    const page = params?.page || 1;
    const offset = (page - 1) * limit;

    return {
      products: results.slice(offset, offset + limit),
      total,
    };
  },

  getProductById(id: string): Product | null {
    const data = getDb();
    const product = data.products.find(p => p.id === id || p.slug === id);
    if (!product) return null;

    const shop = data.shops.find(s => s.id === product.shopId);
    return {
      ...product,
      shop
    };
  },

  createProduct(productData: Omit<Product, "id" | "viewsCount" | "clicksCount" | "createdAt" | "updatedAt">): Product {
    const data = getDb();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      viewsCount: 0,
      clicksCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.products.push(newProduct);
    saveDb(data);

    const shop = data.shops.find(s => s.id === newProduct.shopId);
    return { ...newProduct, shop };
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const data = getDb();
    const index = data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    data.products[index] = {
      ...data.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDb(data);

    const shop = data.shops.find(s => s.id === data.products[index].shopId);
    return { ...data.products[index], shop };
  },

  deleteProduct(id: string): boolean {
    const data = getDb();
    const initialLen = data.products.length;
    data.products = data.products.filter(p => p.id !== id);
    if (data.products.length !== initialLen) {
      saveDb(data);
      return true;
    }
    return false;
  },

  incrementProductView(id: string): void {
    const data = getDb();
    const p = data.products.find(item => item.id === id || item.slug === id);
    if (p) {
      p.viewsCount += 1;
      saveDb(data);
    }
  },

  incrementProductClick(id: string): void {
    const data = getDb();
    const p = data.products.find(item => item.id === id || item.slug === id);
    if (p) {
      p.clicksCount += 1;
      saveDb(data);
    }
  },

  // Recipient Profiles
  getRecipientProfiles(userId: string): RecipientProfile[] {
    const data = getDb();
    return data.recipientProfiles.filter(r => r.userId === userId);
  },

  getRecipientProfileById(id: string): RecipientProfile | null {
    const data = getDb();
    return data.recipientProfiles.find(r => r.id === id) || null;
  },

  createRecipientProfile(profile: Omit<RecipientProfile, "id" | "createdAt" | "updatedAt">): RecipientProfile {
    const data = getDb();
    const newProfile: RecipientProfile = {
      ...profile,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.recipientProfiles.push(newProfile);
    saveDb(data);
    return newProfile;
  },

  deleteRecipientProfile(id: string, userId: string): boolean {
    const data = getDb();
    const initialLen = data.recipientProfiles.length;
    data.recipientProfiles = data.recipientProfiles.filter(r => !(r.id === id && r.userId === userId));
    if (data.recipientProfiles.length !== initialLen) {
      saveDb(data);
      return true;
    }
    return false;
  },

  // Favorites
  getFavorites(userId: string): { products: Product[]; shops: Shop[] } {
    const data = getDb();
    const userFavs = data.favorites.filter(f => f.userId === userId);

    const productIds = userFavs.filter(f => f.productId).map(f => f.productId!);
    const shopIds = userFavs.filter(f => f.shopId).map(f => f.shopId!);

    const shopMap = new Map(data.shops.map(s => [s.id, s]));

    const products = data.products
      .filter(p => productIds.includes(p.id))
      .map(p => ({
        ...p,
        shop: shopMap.get(p.shopId)
      }));

    const shops = data.shops.filter(s => shopIds.includes(s.id));

    return { products, shops };
  },

  toggleFavoriteProduct(userId: string, productId: string): boolean {
    const data = getDb();
    const existingIndex = data.favorites.findIndex(f => f.userId === userId && f.productId === productId);

    if (existingIndex >= 0) {
      data.favorites.splice(existingIndex, 1);
      saveDb(data);
      return false; // removed
    } else {
      data.favorites.push({
        id: `fav-${Date.now()}`,
        userId,
        productId,
        createdAt: new Date().toISOString(),
      });
      saveDb(data);
      return true; // added
    }
  },

  toggleFavoriteShop(userId: string, shopId: string): boolean {
    const data = getDb();
    const existingIndex = data.favorites.findIndex(f => f.userId === userId && f.shopId === shopId);

    if (existingIndex >= 0) {
      data.favorites.splice(existingIndex, 1);
      saveDb(data);
      return false; // removed
    } else {
      data.favorites.push({
        id: `fav-${Date.now()}`,
        userId,
        shopId,
        createdAt: new Date().toISOString(),
      });
      saveDb(data);
      return true; // added
    }
  },

  // Saved Lists
  getSavedLists(userId: string): SavedList[] {
    const data = getDb();
    const shopMap = new Map(data.shops.map(s => [s.id, s]));

    return data.savedLists
      .filter(l => l.userId === userId)
      .map(l => ({
        ...l,
        items: data.products
          .filter(p => l.itemIds.includes(p.id))
          .map(p => ({ ...p, shop: shopMap.get(p.shopId) }))
      }));
  },

  createSavedList(list: Omit<SavedList, "id" | "createdAt" | "updatedAt">): SavedList {
    const data = getDb();
    const newList: SavedList = {
      ...list,
      id: `list-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.savedLists.push(newList);
    saveDb(data);
    return newList;
  },

  // Categories & Occasions
  getCategories(): Category[] {
    return getDb().categories;
  },

  getOccasions(): Occasion[] {
    return getDb().occasions;
  },

  // Analytics
  trackEvent(event: Omit<AnalyticsEvent, "id" | "createdAt">): AnalyticsEvent {
    const data = getDb();
    const newEvent: AnalyticsEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    data.analyticsEvents.push(newEvent);

    // Also update click counts if it's an outbound click
    if (newEvent.eventType.startsWith("OUTBOUND_") && newEvent.entityId) {
      const prod = data.products.find(p => p.id === newEvent.entityId);
      if (prod) {
        prod.clicksCount += 1;
      }
    }

    saveDb(data);
    return newEvent;
  },

  getAnalyticsSummary() {
    const data = getDb();
    const events = data.analyticsEvents;

    const totalSearches = events.filter(e => e.eventType === "SEARCH_QUERY" || e.eventType === "AI_SEARCH").length;
    const totalOutboundClicks = events.filter(e => e.eventType.startsWith("OUTBOUND_")).length;
    const totalProductViews = events.filter(e => e.eventType === "PRODUCT_VIEW").length;

    const whatsappClicks = events.filter(e => e.eventType === "OUTBOUND_WHATSAPP").length;
    const instagramClicks = events.filter(e => e.eventType === "OUTBOUND_INSTAGRAM").length;
    const websiteClicks = events.filter(e => e.eventType === "OUTBOUND_WEBSITE").length;

    // Search query analysis
    const searchQueries = events
      .filter(e => e.query)
      .map(e => e.query!)
      .slice(-20);

    return {
      totalShops: data.shops.length,
      totalProducts: data.products.length,
      totalUsers: data.users.length,
      totalSearches,
      totalProductViews,
      totalOutboundClicks,
      breakdown: {
        whatsappClicks,
        instagramClicks,
        websiteClicks
      },
      recentSearches: searchQueries
    };
  },

  // Users
  getUser(id: string): User | null {
    const data = getDb();
    return data.users.find(u => u.id === id || u.email === id) || null;
  }
};
