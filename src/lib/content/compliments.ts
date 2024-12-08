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
  prefix: string[]; // Different ways to start a compliment for this category
};

export const categories: ComplimentCategory[] = [
  {
    id: "habits",
    name: "habits",
    label: "HABITS",
    description: "Daily routines and behaviors",
    prefix: [
      "You're the kind of person who",
      "You're definitely someone who",
      "You're the type who",
    ],
  },
  {
    id: "creativity",
    name: "creativity",
    label: "CREATIVE",
    description: "Artistic and imaginative traits",
    prefix: [
      "You're the creative soul who",
      "You're the artist who",
      "You're the kind of creative who",
    ],
  },
  {
    id: "organization",
    name: "organization",
    label: "ORGANIZED",
    description: "Unique organizing habits",
    prefix: [
      "You're the organizer who",
      "You're the planner who",
      "You're the type of person who",
    ],
  },
  {
    id: "kindness",
    name: "kindness",
    label: "KIND",
    description: "Acts of kindness and empathy",
    prefix: [
      "You're the thoughtful person who",
      "You're the kind soul who",
      "You're someone who",
    ],
  },
  {
    id: "fun",
    name: "fun",
    label: "FUN",
    description: "Playful and entertaining qualities",
    prefix: [
      "You're the fun person who",
      "You're definitely the one who",
      "You're the friend who",
    ],
  },
];

// Compliments organized by category with proper grammar
export const complimentsByCategory = {
  habits: [
    "always remembers to bring a jacket just in case someone else gets cold",
    // "has a specific morning routine for weekdays and a completely different one for weekends",
    // "keeps backup charging cables in every room 'just in case'",
    // "maintains different walking speeds for different types of streets",
    // "categorizes groceries by shop layout rather than food groups",
    // "sets multiple alarms with increasingly dramatic names",
    // "has a special voice just for talking to plants",
    // "alphabetizes the spice rack but has a chaos drawer in every room",
    // "saves Instagram posts in extremely specific folder categories",
  ],
  creativity: [
    "creates spotify playlists for extremely specific moods",
    // "doodles perfect little spirals during every phone call",
    // "turns leftovers into 'brand new recipes' by changing the plating",
    // "writes shopping lists in color-coded haiku format",
    // "designs elaborate coffee station layouts but always makes instant coffee",
    // "creates backstories for random objects in your house",
    // "maintains a collection of 'emergency craft supplies' that keeps growing",
    // "takes aesthetic photos of mundane things like parking meters",
    // "has different fonts for different types of notes",
    // "writes movie reviews in the style of Victorian literature",
  ],
  organization: [
    "organizes books by color but remembers their location by author",
    // "has a detailed system for organizing digital files that nobody else understands",
    // "labels everything in the fridge except the most obvious items",
    // "sorts clothes by 'vibe' instead of season",
    // "maintains multiple to-do lists for different energy levels",
    // "has a perfectly organized desktop but 47 tabs open",
    // "creates spreadsheets for the most random things",
    // "arranges apps by color but can never find them",
    // "keeps a 'misc drawer' that's actually secretly organized",
    // "has different notebooks for different types of ideas",
  ],
  kindness: [
    "secretly waters the office plants when no one's watching",
    // "always carries extra hair ties to share with strangers",
    // "leaves positive reviews for small businesses after good experiences",
    // "remembers everyone's coffee order and dietary restrictions",
    // "picks up litter while pretending to tie their shoelaces",
    // "saves interesting articles to share with specific friends",
    // "notices when someone changes their hair slightly",
    // "keeps emergency snacks for friends' specific preferences",
    // "remembers random details from conversations months ago",
    // "secretly pays for strangers' coffee but never tells anyone",
  ],
  fun: [
    "turns every minor inconvenience into a dramatic story",
    // "names all their tech devices after fictional characters",
    // "creates elaborate backstories for neighborhood cats",
    // "has different dance moves for different household chores",
    // "invents new words for specific situations and actually gets them to catch on",
    // "makes sound effects for everyday activities",
    // "narrates their pet's thoughts in a specific voice",
    // "has a collection of random facts for every occasion",
    // "creates theme songs for regular activities",
    // "gives weird nicknames to everyday objects",
  ],
};

export const ensureCorrectGrammar = (
  prefix: string,
  compliment: string
): string => {
  // Remove any trailing periods from the compliment
  compliment = compliment.replace(/\.$/, "");

  // Add proper spacing and period
  return `${prefix} ${compliment}.`;
};

export const generateCompliment = (): ComplimentType => {
  // Select random category
  const category = categories[Math.floor(Math.random() * categories.length)];

  // Get compliments for this category
  const categoryCompliments =
    complimentsByCategory[category.id as keyof typeof complimentsByCategory];

  // Select random prefix and compliment
  const prefix =
    category.prefix[Math.floor(Math.random() * category.prefix.length)];
  const compliment =
    categoryCompliments[Math.floor(Math.random() * categoryCompliments.length)];

  return {
    id: crypto.randomUUID(),
    text: ensureCorrectGrammar(prefix, compliment),
    category: category.id,
    timestamp: new Date(),
    isFavorite: false,
  };
};

// Helper function to generate a compliment for a specific category
export const generateCategoryCompliment = (
  categoryId: string
): ComplimentType | null => {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return null;

  const categoryCompliments =
    complimentsByCategory[categoryId as keyof typeof complimentsByCategory];
  const prefix =
    category.prefix[Math.floor(Math.random() * category.prefix.length)];
  const compliment =
    categoryCompliments[Math.floor(Math.random() * categoryCompliments.length)];

  return {
    id: crypto.randomUUID(),
    text: ensureCorrectGrammar(prefix, compliment),
    category: category.id,
    timestamp: new Date(),
    isFavorite: false,
  };
};
