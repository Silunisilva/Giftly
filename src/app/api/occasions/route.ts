import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const occasions = db.getOccasions();
    return NextResponse.json({ success: true, data: occasions });
  } catch (error) {
    console.error("Error fetching occasions:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
