import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GiftSearchParams } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const params: GiftSearchParams = {
      query: searchParams.get("query") || undefined,
      category: searchParams.get("category") || undefined,
      occasion: searchParams.get("occasion") || undefined,
      recipient: searchParams.get("recipient") || undefined,
      giftType: searchParams.get("giftType") || undefined,
      shopSlug: searchParams.get("shopSlug") || undefined,
      district: searchParams.get("district") || undefined,
      city: searchParams.get("city") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      sort: (searchParams.get("sort") as GiftSearchParams["sort"]) || "recommended",
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 50,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    };

    const result = db.getProducts(params);

    // Track search query event if present
    if (params.query) {
      db.trackEvent({
        eventType: "SEARCH_QUERY",
        query: params.query,
      });
    }

    return NextResponse.json({
      success: true,
      data: result.products,
      total: result.total,
      page: params.page,
      limit: params.limit,
    });
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.price || !body.shopId || !body.category) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const newProduct = db.createProduct({
      shopId: body.shopId,
      name: body.name,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description: body.description || "",
      price: Number(body.price),
      currency: body.currency || "LKR",
      imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
      galleryImages: body.galleryImages || [],
      productUrl: body.productUrl || "",
      category: body.category,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(",").map((s: string) => s.trim()) : []),
      occasions: Array.isArray(body.occasions) ? body.occasions : (body.occasions ? body.occasions.split(",").map((s: string) => s.trim()) : []),
      recipientTypes: Array.isArray(body.recipientTypes) ? body.recipientTypes : (body.recipientTypes ? body.recipientTypes.split(",").map((s: string) => s.trim()) : []),
      interests: Array.isArray(body.interests) ? body.interests : (body.interests ? body.interests.split(",").map((s: string) => s.trim()) : []),
      giftTypes: Array.isArray(body.giftTypes) ? body.giftTypes : (body.giftTypes ? body.giftTypes.split(",").map((s: string) => s.trim()) : ["Thoughtful"]),
      minBudget: body.minBudget ? Number(body.minBudget) : undefined,
      maxBudget: body.maxBudget ? Number(body.maxBudget) : undefined,
      isFeatured: Boolean(body.isFeatured),
      isActive: true,
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
