import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user-shopper";

    const profiles = db.getRecipientProfiles(userId);
    return NextResponse.json({ success: true, data: profiles });
  } catch (error) {
    console.error("Error getting recipient profiles:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "user-shopper";

    if (!body.name || !body.relationship) {
      return NextResponse.json({ success: false, message: "Name and relationship are required." }, { status: 400 });
    }

    const created = db.createRecipientProfile({
      userId,
      name: body.name,
      relationship: body.relationship,
      ageGroup: body.ageGroup || "20s",
      interests: Array.isArray(body.interests) ? body.interests : (body.interests ? body.interests.split(",").map((s: string) => s.trim()) : []),
      preferredStyles: Array.isArray(body.preferredStyles) ? body.preferredStyles : (body.preferredStyles ? body.preferredStyles.split(",").map((s: string) => s.trim()) : ["Thoughtful"]),
      minBudget: body.minBudget ? Number(body.minBudget) : 2000,
      maxBudget: body.maxBudget ? Number(body.maxBudget) : 8000,
      birthday: body.birthday || "",
      notes: body.notes || "",
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating recipient profile:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId") || "user-shopper";

    if (!id) {
      return NextResponse.json({ success: false, message: "Profile ID required" }, { status: 400 });
    }

    const deleted = db.deleteRecipientProfile(id, userId);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipient profile:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
