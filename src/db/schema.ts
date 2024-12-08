// src/db/schema.ts
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const compliments = sqliteTable("compliments", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  category: text("category").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const votes = sqliteTable(
  "votes",
  {
    id: text("id").primaryKey(),
    complimentId: text("compliment_id")
      .references(() => compliments.id)
      .notNull(),
    sessionId: text("session_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    uniqueVote: unique().on(table.complimentId, table.sessionId),
  })
);

export const rateLimits = sqliteTable("rate_limits", {
  id: text("id").primaryKey(),
  count: integer("count").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
