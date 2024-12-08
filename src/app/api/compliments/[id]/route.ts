// app/api/compliments/[id]/route.ts
import { db } from "@/db";
import { compliments, votes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await db
      .select({
        id: compliments.id,
        text: compliments.text,
        category: compliments.category,
        createdAt: compliments.createdAt,
        voteCount: sql<number>`count(${votes.id})`.as("vote_count"),
      })
      .from(compliments)
      .leftJoin(votes, eq(votes.complimentId, compliments.id))
      .where(eq(compliments.id, params.id))
      .groupBy(compliments.id)
      .get();

    if (!result) {
      return NextResponse.json(
        { error: "Compliment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch compliment:", error);
    return NextResponse.json(
      { error: "Failed to fetch compliment" },
      { status: 500 }
    );
  }
}
