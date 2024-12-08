/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/compliments/random/route.ts
import { db } from "@/db";
import { votes } from "@/db/schema";

import { count, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.query.compliments.findMany({
      orderBy: sql`RANDOM()`,
      limit: 1,
    });

    const voteCounts = await db
      .select({ count: count() })
      .from(votes)
      .where(eq(votes.complimentId, result[0].id));

    if (!result.length) {
      return NextResponse.json(
        { error: "No compliments found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...result[0], voteCount: voteCounts[0].count });
  } catch (error: any) {
    console.error("Failed to fetch random compliment:", error);
    return NextResponse.json(
      { error: "Failed to fetch random compliment" },
      { status: 500 }
    );
  }
}
