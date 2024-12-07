export type ComplimentType = {
  id: string;
  text: string;
  category: string;
  timestamp: Date;
  isFavorite?: boolean;
};

export type ComplimentCategory = {
  id: string;
  name: string;
  label: string;
  description: string;
};

export const categories: ComplimentCategory[] = [
  {
    id: "fun",
    name: "fun",
    label: "FUN",
    description: "Playful observations about daily life",
  },
  {
    id: "habits",
    name: "habits",
    label: "HABITS",
    description: "Unique personal behaviors",
  },
  {
    id: "quirks",
    name: "quirks",
    label: "QUIRKS",
    description: "Endearing personality traits",
  },
];

export const compliments: string[] = [
  "color-codes their bookshelf but has a secret junk drawer full of chaos",
  "always carries exactly three types of snacks in case of snack emergencies",
  "remembers random movie quotes but forgets why they walked into a room",
  "has a perfectly organized digital calendar but still writes important dates on sticky notes",
  "names their houseplants after historical figures",
  "alphabetizes their spice rack but has a chaotic sock drawer",
  "saves photography presets but always ends up using the same filter",
  "has different playlists for different types of weather",
  "organizes apps by color but can never find them",
  "keeps track of everyone's coffee orders like it's classified information",
  "has a dedicated folder for unused productivity app free trials",
  "maintains a collection of 'emergency' phone chargers in strategic locations",
  "labels everything in the fridge except the most obvious items",
  "has strong opinions about font pairings but uses Comic Sans ironically",
  "creates elaborate spreadsheets for vacation planning but wings it when they get there",
];

export const generateCompliment = (): ComplimentType => {
  const text = compliments[Math.floor(Math.random() * compliments.length)];
  return {
    id: crypto.randomUUID(),
    text: "You're the kind of person who " + text,
    category: "fun", // Default category for now
    timestamp: new Date(),
    isFavorite: false,
  };
};
