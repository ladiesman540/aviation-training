import { db } from "@/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (e) {
    return NextResponse.json(
      { status: "error", database: "disconnected", error: String(e) },
      { status: 503 }
    );
  }
}
