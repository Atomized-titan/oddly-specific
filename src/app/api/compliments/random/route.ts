/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/compliments/random/route.ts
import { db } from "@/db";

import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.query.compliments.findMany({
      orderBy: sql`RANDOM()`,
      limit: 1,
    });

    if (!result.length) {
      return NextResponse.json(
        { error: "No compliments found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error("Failed to fetch random compliment:", error);
    return NextResponse.json(
      { error: "Failed to fetch random compliment" },
      { status: 500 }
    );
  }
}
