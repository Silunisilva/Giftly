import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const summary = db.getAnalyticsSummary();
    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    console.error("Error getting analytics:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.eventType) {
      return NextResponse.json({ success: false, message: "eventType is required" }, { status: 400 });
    }

    const event = db.trackEvent({
      eventType: body.eventType,
      entityId: body.entityId,
      entityType: body.entityType,
      query: body.query,
      metadata: body.metadata,
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    console.error("Error logging analytics:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
