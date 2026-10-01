export const CAFE = {
  name: "Shery Cafe",
  tagline: "Shery Cafe: Taste, Vibe & Entertainment",
  phone: "0339 6030012",
  address: "Defence Phase VI, Karachi, Pakistan",
  hours: "Mon–Sun · 12:00 PM – 2:00 AM",
  deliveryAreas: "DHA Phase 5–8, Clifton, PECHS, Bahadurabad",
  deliveryFeeRs: "Rs 150 flat (free above Rs 2,500)",
};

export interface FaqEntry {
  q: string;
  a: string;
  keywords: string[];
}

export const FAQS: FaqEntry[] = [
  {
    q: "What are your opening hours?",
    a: `We are open ${CAFE.hours}. Kitchen closes at 1:30 AM.`,
    keywords: ["hour", "open", "close", "timing", "when"],
  },
  {
    q: "Where are you located?",
    a: `Find us at ${CAFE.address}. Call ${CAFE.phone} for directions.`,
    keywords: ["where", "location", "address", "direction"],
  },
  {
    q: "Do you deliver?",
    a: `Yes! We deliver to ${CAFE.deliveryAreas}. ${CAFE.deliveryFeeRs}. Average delivery time is 35–45 minutes.`,
    keywords: ["deliver", "delivery", "areas", "shipping"],
  },
  {
    q: "What is the sheesha age policy?",
    a: "Sheesha is strictly 18+. A valid CNIC or ID is required, and our staff will verify age before serving. We do not serve sheesha to minors under any circumstances.",
    keywords: ["sheesha", "age", "18", "id", "cnic", "hookah", "shisha"],
  },
  {
    q: "What are the gaming rates?",
    a: "PS5: Rs 799/hour · VR Experience: Rs 999/30 min · Snooker: Rs 599/hour · Arcade credits: 30 credits with the food combo at Rs 1,199. Combo food + gaming packages are available on the Play Area menu.",
    keywords: ["gaming", "ps5", "vr", "snooker", "arcade", "rate", "price", "play"],
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept Stripe card payments online, JazzCash, EasyPaisa, Cash on Delivery (COD), and Pay at Table for dine-in guests.",
    keywords: ["payment", "pay", "jazzcash", "easypaisa", "stripe", "card", "cod", "cash"],
  },
  {
    q: "How do promo codes work?",
    a: "Enter your code at checkout — e.g. WELCOME10 for 10% off orders above Rs 1,000, or LOUNGE20 for 20% off above Rs 2,000. One code per order.",
    keywords: ["promo", "coupon", "discount", "code", "offer", "deal"],
  },
  {
    q: "Can I reserve a table or gaming slot?",
    a: "Absolutely — use the Reserve page to pick a date, time slot, guests and area (Table, PS5, VR, Snooker or Arcade). You will get instant confirmation on screen.",
    keywords: ["reserve", "reservation", "book", "table", "slot"],
  },
];

export interface MoodRecommendation {
  mood: string;
  keywords: string[];
  itemSlugs: string[];
  blurb: string;
}

export const MOOD_RECOMMENDATIONS: MoodRecommendation[] = [
  {
    mood: "spicy",
    keywords: ["spicy", "hot", "masala", "desi"],
    itemSlugs: ["chicken-tikka-sizzler", "flaming-hot-wings", "chicken-tikka-pizza"],
    blurb: "Feeling bold? These bring the heat.",
  },
  {
    mood: "comfort",
    keywords: ["comfort", "cozy", "cheesy", "creamy"],
    itemSlugs: ["alfredo-pasta", "loaded-cheese-fries", "shery-smash-burger"],
    blurb: "Pure comfort in every bite.",
  },
  {
    mood: "sweet",
    keywords: ["sweet", "dessert", "shake", "craving"],
    itemSlugs: ["oreo-crunch-shake", "mango-tango-smoothie", "signature-spanish-latte"],
    blurb: "Something sweet to finish strong.",
  },
  {
    mood: "chill",
    keywords: ["chill", "relax", "vibe", "lounge"],
    itemSlugs: ["premium-double-apple-sheesha", "blue-lagoon-mocktail", "vietnamese-cold-brew"],
    blurb: "Kick back, lounge mode on. (Sheesha is 18+ only.)",
  },
  {
    mood: "budget",
    keywords: ["budget", "cheap", "deal", "affordable", "student"],
    itemSlugs: ["kashmiri-chai", "club-sandwich-deluxe", "loaded-cheese-fries"],
    blurb: "Big flavour, small bill.",
  },
  {
    mood: "gaming",
    keywords: ["game", "gaming", "ps5", "vr", "snooker", "arcade", "play"],
    itemSlugs: ["ps5-gaming-hour", "vr-experience-30min", "arcade-food-combo"],
    blurb: "Fuel your game night.",
  },
];

export const BUDGET_TIERS = [
  { maxCents: 60000, label: "under Rs 600" },
  { maxCents: 100000, label: "under Rs 1,000" },
  { maxCents: 150000, label: "under Rs 1,500" },
];
