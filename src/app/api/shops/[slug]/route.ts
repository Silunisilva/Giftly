import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const shop = db.getShopBySlug(slug);

    if (!shop) {
      return NextResponse.json({ success: false, message: "Shop not found" }, { status: 404 });
    }

    // Track shop view analytics
    db.trackEvent({
      eventType: "SHOP_VIEW",
      entityId: shop.id,
      entityType: "shop",
    });

    // Fetch this shop's active products
    const { products } = db.getProducts({ shopSlug: shop.slug, limit: 100 });

    return NextResponse.json({
      success: true,
      data: {
        ...shop,
        products,
      }
    });
  } catch (error) {
    console.error("Error fetching shop:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const shop = db.getShopBySlug(slug);
    if (!shop) {
      return NextResponse.json({ success: false, message: "Shop not found" }, { status: 404 });
    }

    const body = await req.json();
    const updated = db.updateShop(shop.id, body);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
