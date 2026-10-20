import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const district = searchParams.get("district") || undefined;
    const isVerified = searchParams.get("isVerified") ? searchParams.get("isVerified") === "true" : undefined;

    const shops = db.getShops({ category, city, district, isVerified });

    return NextResponse.json({
      success: true,
      data: shops,
      total: shops.length,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.description || !body.city || !body.address) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const newShop = db.createShop({
      name: body.name,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      tagLine: body.tagLine || "",
      description: body.description,
      logo: body.logo || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80",
      coverImage: body.coverImage || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80",
      websiteUrl: body.websiteUrl || "",
      instagramUrl: body.instagramUrl || "",
      facebookUrl: body.facebookUrl || "",
      whatsappNumber: body.whatsappNumber || "",
      phone: body.phone || "",
      email: body.email || "",
      address: body.address,
      city: body.city,
      district: body.district || "Colombo",
      categories: Array.isArray(body.categories) ? body.categories : (body.categories ? body.categories.split(",").map((s: string) => s.trim()) : ["Gifts"]),
      isVerified: false,
      status: "ACTIVE",
      ownerId: body.ownerId,
    });

    return NextResponse.json({ success: true, data: newShop }, { status: 201 });
  } catch (error) {
    console.error("Error registering shop:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
