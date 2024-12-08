import { db } from "@/db";
import { compliments, votes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get compliments with vote count
    const results = await db
      .select({
        id: compliments.id,
        text: compliments.text,
        category: compliments.category,
        createdAt: compliments.createdAt,
        voteCount: sql<number>`count(${votes.id})`.as("vote_count"),
      })
      .from(compliments)
      .leftJoin(votes, eq(votes.complimentId, compliments.id))
      .groupBy(compliments.id)
      .orderBy(sql`vote_count DESC`);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to fetch compliments:", error);
    return NextResponse.json(
      { error: "Failed to fetch compliments" },
      { status: 500 }
    );
  }
}

// This could be used for admin purposes
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const result = await db
//       .insert(compliments)
//       .values({
//         id: uuid(),
//         text: body.text,
//         category: body.category,
//         createdAt: new Date(),
//       })
//       .returning();

//     return NextResponse.json(result[0]);
//   } catch (error) {
//     console.error("Failed to create compliment:", error);
//     return NextResponse.json(
//       { error: "Failed to create compliment" },
//       { status: 500 }
//     );
//   }
// }
