// src/db/seed.ts
import { db } from ".";
import { compliments } from "./schema";
import { v4 as uuid } from "uuid";
import {
  categories,
  complimentsByCategory,
  ensureCorrectGrammar,
} from "../lib/content/compliments";

async function clearDatabase() {
  await db.delete(compliments);
}

async function seed() {
  console.log("Starting seed...");

  try {
    // Clear existing data
    await clearDatabase();
    console.log("Cleared existing data");

    // Generate all possible compliments for each category
    for (const category of categories) {
      const categoryCompliments =
        complimentsByCategory[
          category.id as keyof typeof complimentsByCategory
        ];

      // Generate compliments with each prefix
      for (const prefix of category.prefix) {
        for (const complimentText of categoryCompliments) {
          await db.insert(compliments).values({
            id: uuid(),
            text: ensureCorrectGrammar(prefix, complimentText),
            category: category.id,
            createdAt: new Date(),
          });
        }
      }
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  }
}

// Run the seed function
seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
