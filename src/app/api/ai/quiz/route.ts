import { NextRequest, NextResponse } from "next/server";
import { generateQuizRecommendations } from "@/lib/ai/recommendation-engine";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const recipient = body.recipient || "Friend";
    const occasion = body.occasion || "Birthday";
    const budget = body.budget ? Number(body.budget) : 5000;
    const interests = Array.isArray(body.interests) ? body.interests : [];
    const giftStyle = body.giftStyle || "Thoughtful";

    db.trackEvent({
      eventType: "AI_SEARCH",
      query: `Quiz: ${recipient} | ${occasion} | LKR ${budget} | ${giftStyle}`,
    });

    const result = generateQuizRecommendations({
      recipient,
      occasion,
      budget,
      interests,
      giftStyle,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error generating quiz recommendations:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
