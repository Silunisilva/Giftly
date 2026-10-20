import { NextRequest, NextResponse } from "next/server";
import { findGiftRecommendations, parseNaturalLanguageQuery } from "@/lib/ai/recommendation-engine";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || "";
    const conversationHistory = body.history || [];
    const recipient = body.recipient;
    const occasion = body.occasion;
    const budget = body.budget ? Number(body.budget) : undefined;
    const interests = body.interests;
    const giftStyle = body.giftStyle;

    if (!query && !recipient && !occasion) {
      return NextResponse.json({
        success: false,
        message: "Please provide a search prompt or recipient details.",
      }, { status: 400 });
    }

    // Log AI interaction event
    db.trackEvent({
      eventType: "AI_SEARCH",
      query: query || `AI Assistant: ${recipient} / ${occasion} / ${budget}`,
    });

    // Run Recommendation Engine on Pure Node DB
    const results = findGiftRecommendations(query, {
      recipient,
      occasion,
      budget,
      interests: Array.isArray(interests) ? interests : undefined,
      giftStyle,
    });

    const parsed = parseNaturalLanguageQuery(query);
    const topMatches = results.slice(0, 8);

    // Generate natural language conversational summary based on actual retrieved database products
    let aiMessage = "";
    const recipientText = recipient || parsed.recipient || "your recipient";
    const budgetText = (budget || parsed.maxBudget) ? ` within LKR ${(budget || parsed.maxBudget)!.toLocaleString()}` : "";
    const occasionText = occasion || parsed.occasion ? ` for ${occasion || parsed.occasion}` : "";

    if (topMatches.length > 0) {
      const topPick = topMatches[0];
      aiMessage = `I found ${topMatches.length} hand-picked gifts from trusted Sri Lankan shops${occasionText} for ${recipientText}${budgetText}. My top recommendation is the **${topPick.product.name}** from **${topPick.product.shop?.name}** (${topPick.score}% Match) because ${topPick.reasons[0].toLowerCase()}.`;
    } else {
      aiMessage = `I searched our database of Sri Lankan gift shops for "${query}", but couldn't find an exact match within that filter. Try adjusting your budget or exploring other popular categories!`;
    }

    return NextResponse.json({
      success: true,
      data: {
        aiMessage,
        parsedQuery: parsed,
        recommendations: topMatches,
        totalFound: results.length,
      }
    });
  } catch (error) {
    console.error("Error in AI gift search:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
