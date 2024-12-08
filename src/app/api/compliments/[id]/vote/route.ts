// app/api/compliments/[id]/vote/route.ts
import { db } from "@/db";
import { votes, rateLimits } from "@/db/schema";
import { and, eq, lt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

async function checkRateLimit(sessionId: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean old rate limits
  await db
    .delete(rateLimits)
    .where(lt(rateLimits.updatedAt, new Date(windowStart)));

  // Get current count or create new
  const [rateLimit] = await db
    .insert(rateLimits)
    .values({
      id: `vote-${sessionId}`,
      count: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: rateLimits.id,
      set: {
        count: sql`count + 1`,
        updatedAt: new Date(),
      },
    })
    .returning();

  return {
    success: rateLimit.count <= RATE_LIMIT,
    current: rateLimit.count,
    limit: RATE_LIMIT,
    remaining: Math.max(0, RATE_LIMIT - rateLimit.count),
  };
}

// Check if user has voted
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionId = (await cookies()).get("session-id")?.value;
    if (!sessionId) return NextResponse.json({ hasVoted: false });

    const id = (await params).id;

    const vote = await db
      .select()
      .from(votes)
      .where(and(eq(votes.complimentId, id), eq(votes.sessionId, sessionId)))
      .get();

    return NextResponse.json({
      hasVoted: !!vote,
      voteCount: await getVoteCount(id),
    });
  } catch (error) {
    console.error("Failed to check vote status:", error);
    return NextResponse.json(
      { error: "Failed to check vote status" },
      { status: 500 }
    );
  }
}

// Vote for a compliment
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("session-id")?.value;

    if (!sessionId) {
      sessionId = uuid();
      cookieStore.set("session-id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(sessionId);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests", ...rateLimit },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(RATE_LIMIT),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(Date.now() + RATE_LIMIT_WINDOW),
          },
        }
      );
    }

    // Check for existing vote
    const existingVote = await db
      .select()
      .from(votes)
      .where(and(eq(votes.complimentId, id), eq(votes.sessionId, sessionId)))
      .get();

    if (existingVote) {
      return NextResponse.json({ error: "Already voted" }, { status: 400 });
    }

    // Create vote
    await db.insert(votes).values({
      id: uuid(),
      complimentId: id,
      sessionId,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      voteCount: await getVoteCount(id),
    });
  } catch (error) {
    console.error("Failed to vote:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}

// Remove vote
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const sessionId = (await cookies()).get("session-id")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(sessionId);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests", ...rateLimit },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(RATE_LIMIT),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "X-RateLimit-Reset": String(Date.now() + RATE_LIMIT_WINDOW),
          },
        }
      );
    }

    await db
      .delete(votes)
      .where(and(eq(votes.complimentId, id), eq(votes.sessionId, sessionId)));

    return NextResponse.json({
      success: true,
      voteCount: await getVoteCount(id),
    });
  } catch (error) {
    console.error("Failed to remove vote:", error);
    return NextResponse.json(
      { error: "Failed to remove vote" },
      { status: 500 }
    );
  }
}

// Helper function to get vote count
async function getVoteCount(complimentId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(votes)
    .where(eq(votes.complimentId, complimentId))
    .get();

  return result?.count || 0;
}
