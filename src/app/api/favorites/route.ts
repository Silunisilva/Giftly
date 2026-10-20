import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user-shopper";

    const favorites = db.getFavorites(userId);
    return NextResponse.json({ success: true, data: favorites });
  } catch (error) {
    console.error("Error getting favorites:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "user-shopper";

    if (body.productId) {
      const isAdded = db.toggleFavoriteProduct(userId, body.productId);
      return NextResponse.json({ success: true, action: isAdded ? "added" : "removed" });
    }

    if (body.shopId) {
      const isAdded = db.toggleFavoriteShop(userId, body.shopId);
      return NextResponse.json({ success: true, action: isAdded ? "added" : "removed" });
    }

    return NextResponse.json({ success: false, message: "Either productId or shopId is required." }, { status: 400 });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
