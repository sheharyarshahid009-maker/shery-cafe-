import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

async function main() {
  // ── Categories ──────────────────────────────────────────────────────────
  const categories = [
    { name: "Food", slug: "food", sortOrder: 1 },
    { name: "Fast Food", slug: "fast-food", sortOrder: 2 },
    { name: "Beverages & Drinks", slug: "beverages", sortOrder: 3 },
    { name: "Sheesha Lounge", slug: "sheesha", sortOrder: 4 },
    { name: "Play Area", slug: "play-area", sortOrder: 5 },
  ];
  const catBySlug: Record<string, string> = {};
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    });
    catBySlug[c.slug] = row.id;
  }

  // ── Menu items (~24) ────────────────────────────────────────────────────
  type Item = {
    title: string;
    slug: string;
    description: string;
    priceCents: number;
    imageUrl: string;
    category: string;
    tags?: string[];
    spiceLevel?: number;
    isAgeRestricted?: boolean;
    customizationOptions?: unknown;
  };

  const items: Item[] = [
    // Food — Starters
    {
      title: "Crispy Dynamite Chicken",
      slug: "crispy-dynamite-chicken",
      description:
        "Golden-fried chicken tossed in our signature dynamite sauce with toasted sesame and spring onion.",
      priceCents: 74900,
      imageUrl: IMG("photo-1562967914-608f82629710"),
      category: "food",
      tags: ["Bestseller"],
      spiceLevel: 2,
      customizationOptions: [
        {
          name: "Spice level",
          type: "single",
          choices: [
            { label: "Mild", priceDeltaCents: 0 },
            { label: "Medium", priceDeltaCents: 0 },
            { label: "Extra hot", priceDeltaCents: 0 },
          ],
        },
      ],
    },
    {
      title: "Loaded Nachos Platter",
      slug: "loaded-nachos-platter",
      description:
        "House nachos layered with cheddar, jalapenos, salsa roja, sour cream and guacamole.",
      priceCents: 89900,
      imageUrl: IMG("photo-1513456852971-30c0b8199d4d"),
      category: "food",
      tags: ["Chef Special"],
      spiceLevel: 2,
    },
    {
      title: "Chicken Tikka Sizzler",
      slug: "chicken-tikka-sizzler",
      description:
        "Char-grilled tikka served sizzling with mint chutney, onion rings and butter naan.",
      priceCents: 94900,
      imageUrl: IMG("photo-1599487488170-d11ec9c172f0"),
      category: "food",
      spiceLevel: 3,
    },
    {
      title: "Continental Grilled Platter",
      slug: "continental-grilled-platter",
      description:
        "Grilled chicken steak, herb rice, sauteed vegetables and pepper sauce — a full continental spread.",
      priceCents: 129900,
      imageUrl: IMG("photo-1544025162-d76694265947"),
      category: "food",
      tags: ["Chef Special"],
      spiceLevel: 1,
    },
    {
      title: "Alfredo Pasta",
      slug: "alfredo-pasta",
      description:
        "Creamy parmesan alfredo with grilled chicken strips, mushrooms and garlic bread on the side.",
      priceCents: 109900,
      imageUrl: IMG("photo-1621996346565-e3dbc646d9a9"),
      category: "food",
      customizationOptions: [
        {
          name: "Add-ons",
          type: "multi",
          choices: [
            { label: "Extra cheese", priceDeltaCents: 15000 },
            { label: "Extra chicken", priceDeltaCents: 25000 },
          ],
        },
      ],
    },
    // Fast food
    {
      title: "Shery Smash Burger",
      slug: "shery-smash-burger",
      description:
        "Double smashed beef patty, cheddar, caramelised onions and smoky house sauce in a brioche bun.",
      priceCents: 89900,
      imageUrl: IMG("photo-1568901346375-23c9450c58cd"),
      category: "fast-food",
      tags: ["Bestseller"],
      customizationOptions: [
        {
          name: "Add-ons",
          type: "multi",
          choices: [
            { label: "Extra cheese", priceDeltaCents: 12000 },
            { label: "Extra patty", priceDeltaCents: 30000 },
          ],
        },
      ],
    },
    {
      title: "Zinger Stacker",
      slug: "zinger-stacker",
      description:
        "Crispy zinger fillet, spicy mayo, lettuce and cheese stacked tall with a side of fries.",
      priceCents: 74900,
      imageUrl: IMG("photo-1606755962773-d324e0a13086"),
      category: "fast-food",
      spiceLevel: 2,
    },
    {
      title: "Loaded Cheese Fries",
      slug: "loaded-cheese-fries",
      description:
        "Crispy fries smothered in cheese sauce, chicken crumble, jalapenos and chipotle drizzle.",
      priceCents: 59900,
      imageUrl: IMG("photo-1573080496219-bb080dd4f877"),
      category: "fast-food",
      tags: ["Bestseller"],
      spiceLevel: 1,
    },
    {
      title: "Flaming Hot Wings (8 pc)",
      slug: "flaming-hot-wings",
      description:
        "Eight flame-grilled wings glazed in our hottest sauce, served with cool ranch dip.",
      priceCents: 84900,
      imageUrl: IMG("photo-1527477396000-e27163b481c2"),
      category: "fast-food",
      spiceLevel: 3,
    },
    {
      title: "Chicken Tikka Pizza (Medium)",
      slug: "chicken-tikka-pizza",
      description:
        "Wood-fired medium pizza with tikka chicken, mozzarella, onions and capsicum on a desi-spiced base.",
      priceCents: 139900,
      imageUrl: IMG("photo-1565299624946-b28f40a0ae38"),
      category: "fast-food",
      tags: ["Chef Special"],
      spiceLevel: 2,
    },
    {
      title: "Club Sandwich Deluxe",
      slug: "club-sandwich-deluxe",
      description:
        "Triple-layered grilled chicken, egg and cheese club with fries and coleslaw.",
      priceCents: 69900,
      imageUrl: IMG("photo-1528735602780-2552fd46c7af"),
      category: "fast-food",
    },
    // Beverages
    {
      title: "Signature Spanish Latte",
      slug: "signature-spanish-latte",
      description:
        "Double-shot espresso with condensed milk silk and a caramelised top — our most loved brew.",
      priceCents: 54900,
      imageUrl: IMG("photo-1541167760496-1628856ab772"),
      category: "beverages",
      tags: ["Bestseller"],
      customizationOptions: [
        {
          name: "Sugar level",
          type: "single",
          choices: [
            { label: "No sugar", priceDeltaCents: 0 },
            { label: "Less sweet", priceDeltaCents: 0 },
            { label: "Regular", priceDeltaCents: 0 },
          ],
        },
        {
          name: "Milk",
          type: "single",
          choices: [
            { label: "Dairy", priceDeltaCents: 0 },
            { label: "Oat milk", priceDeltaCents: 10000 },
          ],
        },
      ],
    },
    {
      title: "Vietnamese Cold Brew",
      slug: "vietnamese-cold-brew",
      description:
        "18-hour slow-steeped cold brew over condensed milk and ice — bold, smooth, unforgettable.",
      priceCents: 59900,
      imageUrl: IMG("photo-1517701550927-30cf4ba1dba5"),
      category: "beverages",
    },
    {
      title: "Blue Lagoon Mocktail",
      slug: "blue-lagoon-mocktail",
      description:
        "Electric citrus cooler with blue curacao syrup, soda and mint — zero alcohol, full vibe.",
      priceCents: 49900,
      imageUrl: IMG("photo-1551538827-9c037cb4f32a"),
      category: "beverages",
    },
    {
      title: "Mango Tango Smoothie",
      slug: "mango-tango-smoothie",
      description:
        "Thick-blended seasonal mangoes, yogurt and honey topped with crushed pistachio.",
      priceCents: 54900,
      imageUrl: IMG("photo-1638176066666-ffb2f013c7dd"),
      category: "beverages",
      tags: ["Chef Special"],
    },
    {
      title: "Oreo Crunch Shake",
      slug: "oreo-crunch-shake",
      description:
        "Cookies-and-cream thick shake crowned with whipped cream and Oreo crumble.",
      priceCents: 64900,
      imageUrl: IMG("photo-1577805947697-89e18249d767"),
      category: "beverages",
      tags: ["Bestseller"],
    },
    {
      title: "Kashmiri Chai",
      slug: "kashmiri-chai",
      description:
        "Traditional pink tea brewed with green tea leaves, milk and crushed nuts.",
      priceCents: 39900,
      imageUrl: IMG("photo-1571934811356-5cc061b6821f"),
      category: "beverages",
    },
    // Sheesha lounge (18+)
    {
      title: "Premium Double Apple Sheesha",
      slug: "premium-double-apple-sheesha",
      description:
        "Classic double-apple premium tobacco with ice base and fresh mint. Strictly 18+.",
      priceCents: 149900,
      imageUrl: IMG("photo-1527661591475-527312dd65f5"),
      category: "sheesha",
      isAgeRestricted: true,
      tags: ["Bestseller"],
      customizationOptions: [
        {
          name: "Base",
          type: "single",
          choices: [
            { label: "Water", priceDeltaCents: 0 },
            { label: "Ice base", priceDeltaCents: 20000 },
            { label: "Milk base", priceDeltaCents: 30000 },
          ],
        },
      ],
    },
    {
      title: "Blue Mist Special Mix",
      slug: "blue-mist-special-mix",
      description:
        "Our signature blue mist + mint + ice blend for extra smooth clouds. Strictly 18+.",
      priceCents: 169900,
      imageUrl: IMG("photo-1519671482749-fd09be7ccebf"),
      category: "sheesha",
      isAgeRestricted: true,
      tags: ["Chef Special"],
    },
    // Play area
    {
      title: "PS5 Gaming — 1 Hour",
      slug: "ps5-gaming-hour",
      description:
        "One hour on PS5 with the latest titles, comfy lounge seating and a complimentary soft drink.",
      priceCents: 79900,
      imageUrl: IMG("photo-1606813907291-d86efa9b94db"),
      category: "play-area",
      tags: ["Bestseller"],
    },
    {
      title: "VR Experience — 30 Min",
      slug: "vr-experience-30min",
      description:
        "Immersive 30-minute VR session with curated games. Staff-assisted setup included.",
      priceCents: 99900,
      imageUrl: IMG("photo-1622979135225-d2ba269cf1ac"),
      category: "play-area",
    },
    {
      title: "Snooker Table — 1 Hour",
      slug: "snooker-table-hour",
      description:
        "Full-size snooker table booking for one hour, cues and chalk included.",
      priceCents: 59900,
      imageUrl: IMG("photo-1615729947596-a598e5de0ab3"),
      category: "play-area",
    },
    {
      title: "Arcade + Food Combo",
      slug: "arcade-food-combo",
      description:
        "30 arcade credits plus a zinger burger and soft drink — the ultimate hangout package.",
      priceCents: 119900,
      imageUrl: IMG("photo-1511882150382-421056c89033"),
      category: "play-area",
      tags: ["Chef Special"],
    },
  ];

  for (const item of items) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        description: item.description,
        priceCents: item.priceCents,
        imageUrl: item.imageUrl,
        categoryId: catBySlug[item.category],
        tags: item.tags ?? [],
        spiceLevel: item.spiceLevel ?? null,
        isAgeRestricted: item.isAgeRestricted ?? false,
        isAvailable: true,
        customizationOptions: (item.customizationOptions ?? null) as never,
      },
      create: {
        title: item.title,
        slug: item.slug,
        description: item.description,
        priceCents: item.priceCents,
        imageUrl: item.imageUrl,
        categoryId: catBySlug[item.category],
        tags: item.tags ?? [],
        spiceLevel: item.spiceLevel ?? null,
        isAgeRestricted: item.isAgeRestricted ?? false,
        customizationOptions: (item.customizationOptions ?? null) as never,
      },
    });
  }

  // ── Promo codes ─────────────────────────────────────────────────────────
  const promos = [
    {
      code: "WELCOME10",
      percentOff: 10,
      maxDiscountCents: 50000,
      minOrderCents: 100000,
      active: true,
    },
    {
      code: "LOUNGE20",
      percentOff: 20,
      maxDiscountCents: 100000,
      minOrderCents: 200000,
      active: true,
    },
  ];
  for (const p of promos) {
    await prisma.promoCode.upsert({
      where: { code: p.code },
      update: p,
      create: p,
    });
  }

  // ── Admin user ──────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@sherycafe.com";
  const adminHash =
    process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD_HASH.includes("REPLACE")
      ? process.env.ADMIN_PASSWORD_HASH
      : await bcrypt.hash("shery-admin-123", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", passwordHash: adminHash, name: "Shery Admin" },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      role: "ADMIN",
      name: "Shery Admin",
    },
  });

  // ── Banners ─────────────────────────────────────────────────────────────
  const banners = [
    {
      title: "Lounge Nights Every Weekend",
      subtitle: "Live sheesha, gaming tournaments and late-night bites till 2 AM.",
      imageUrl: IMG("photo-1514933651103-005eec06c04b"),
      ctaText: "Reserve a Table",
      ctaHref: "/book",
      active: true,
      sortOrder: 1,
    },
    {
      title: "Flat 20% Off with LOUNGE20",
      subtitle: "Order online above Rs 2,000 and save on your feast.",
      imageUrl: IMG("photo-1504674900247-0877df9cc836"),
      ctaText: "Order Online",
      ctaHref: "/menu",
      active: true,
      sortOrder: 2,
    },
  ];
  for (const b of banners) {
    const existing = await prisma.banner.findFirst({ where: { title: b.title } });
    if (existing) {
      await prisma.banner.update({ where: { id: existing.id }, data: b });
    } else {
      await prisma.banner.create({ data: b });
    }
  }

  console.log("Seed complete: categories, menu items, promos, admin, banners.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
