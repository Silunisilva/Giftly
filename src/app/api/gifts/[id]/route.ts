import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const product = db.getProductById(id);

    if (!product) {
      return NextResponse.json({ success: false, message: "Gift not found" }, { status: 404 });
    }

    // Increment view count & track product view analytics
    db.incrementProductView(product.id);
    db.trackEvent({
      eventType: "PRODUCT_VIEW",
      entityId: product.id,
      entityType: "product",
    });

    // Fetch related gifts from same category or shop
    const { products: related } = db.getProducts({
      category: product.category,
      limit: 6,
    });
    const filteredRelated = related.filter(p => p.id !== product.id).slice(0, 4);

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        relatedGifts: filteredRelated,
      }
    });
  } catch (error) {
    console.error("Error fetching gift details:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updated = db.updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "Gift not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating gift:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deleted = db.deleteProduct(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Gift not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Gift deleted successfully" });
  } catch (error) {
    console.error("Error deleting gift:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
