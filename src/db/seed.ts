// src/db/seed.ts
import { db } from ".";
import { compliments } from "./schema";
import { v4 as uuid } from "uuid";

const seed = async () => {
  console.log("Seeding database...");

  await db.insert(compliments).values([
    {
      id: uuid(),
      text: "You're the kind of person who creates spotify playlists for extremely specific moods.",
      category: "creativity",
      createdAt: new Date(),
    },
    {
      id: uuid(),
      text: "You're definitely someone who has a specific morning routine for weekdays and a completely different one for weekends.",
      category: "habits",
      createdAt: new Date(),
    },
    // Add more initial compliments...
  ]);

  console.log("Seeding completed!");
};

seed().catch((err) => {
  console.error("Seeding failed!");
  console.error(err);
  process.exit(1);
});
