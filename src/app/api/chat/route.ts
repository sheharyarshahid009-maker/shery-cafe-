import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { FAQS, MOOD_RECOMMENDATIONS, CAFE } from "@/data/faq";

const Body = z.object({
  message: z.string().min(1).max(500),
});

type ChatAction =
  | {
      type: "add_to_cart";
      menuItemId: string;
      title: string;
      priceCents: number;
      imageUrl?: string | null;
      isAgeRestricted: boolean;
    }
  | { type: "link"; href: string; label: string };

interface ChatReply {
  reply: string;
  suggestions: string[];
  actions: ChatAction[];
}

const SUGGESTIONS = [
  "Recommend something spicy",
  "Best under Rs 1,000?",
  "Gaming rates?",
  "Sheesha policy?",
  "Book a table",
];

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

export async function POST(req: NextRequest) {
  try {
    const { message } = Body.parse(await req.json());
    const text = message.toLowerCase().trim();

    // 1) Booking intent
    if (includesAny(text, ["book", "reserve", "reservation", "table booking"])) {
      const reply: ChatReply = {
        reply:
          "You can reserve a dining table or a gaming slot (PS5, VR, Snooker, Arcade) in under a minute. Pick your date, time slot and guests — confirmation is instant.",
        suggestions: ["Gaming rates?", "Opening hours?"],
        actions: [{ type: "link", href: "/book", label: "Reserve now" }],
      };
      return NextResponse.json(reply);
    }

    // 2) Order / menu intent
    if (
      includesAny(text, ["order", "menu", "food", "eat", "hungry", "dish"])
    ) {
      const reply: ChatReply = {
        reply:
          "Our menu spans Food, Fast Food, Beverages, the Sheesha Lounge (18+) and the Play Area. Tell me a mood — spicy, comfort, sweet, chill, budget — and I will recommend dishes.",
        suggestions: ["Recommend something spicy", "Best under Rs 1,000?"],
        actions: [{ type: "link", href: "/menu", label: "Browse full menu" }],
      };
      return NextResponse.json(reply);
    }

    // 3) Mood-based recommendations
    for (const mood of MOOD_RECOMMENDATIONS) {
      if (includesAny(text, mood.keywords)) {
        const items = await prisma.menuItem.findMany({
          where: { slug: { in: mood.itemSlugs }, isAvailable: true },
          select: {
            id: true,
            title: true,
            priceCents: true,
            imageUrl: true,
            isAgeRestricted: true,
          },
        });
        const actions: ChatAction[] = items.map((i) => ({
          type: "add_to_cart",
          menuItemId: i.id,
          title: i.title,
          priceCents: i.priceCents,
          imageUrl: i.imageUrl,
          isAgeRestricted: i.isAgeRestricted,
        }));
        const lines = items
          .map(
            (i) =>
              `• ${i.title} — Rs ${(i.priceCents / 100).toFixed(0)}${
                i.isAgeRestricted ? " (18+)" : ""
              }`
          )
          .join("\n");
        const reply: ChatReply = {
          reply: `${mood.blurb}\n${lines}`,
          suggestions: ["Book a table", "Any promo codes?"],
          actions,
        };
        return NextResponse.json(reply);
      }
    }

    // 4) Budget query — "under 1000" / "under rs 600"
    const budgetMatch = text.match(/under\s*(?:rs\.?\s*)?(\d[\d,]*)/);
    if (budgetMatch || includesAny(text, ["cheap", "budget", "affordable"])) {
      const cap = budgetMatch
        ? Number(budgetMatch[1].replace(/,/g, "")) * 100
        : 100000;
      const items = await prisma.menuItem.findMany({
        where: { isAvailable: true, priceCents: { lte: cap } },
        orderBy: { priceCents: "asc" },
        take: 5,
        select: {
          id: true,
          title: true,
          priceCents: true,
          imageUrl: true,
          isAgeRestricted: true,
        },
      });
      const reply: ChatReply = {
        reply:
          items.length === 0
            ? "Nothing fits that budget right now — try a slightly higher range."
            : `Great picks under Rs ${(cap / 100).toFixed(0)}:\n` +
              items
                .map(
                  (i) => `• ${i.title} — Rs ${(i.priceCents / 100).toFixed(0)}`
                )
                .join("\n"),
        suggestions: ["Recommend something sweet", "Book a table"],
        actions: items.map((i) => ({
          type: "add_to_cart" as const,
          menuItemId: i.id,
          title: i.title,
          priceCents: i.priceCents,
          imageUrl: i.imageUrl,
          isAgeRestricted: i.isAgeRestricted,
        })),
      };
      return NextResponse.json(reply);
    }

    // 5) FAQ matching
    for (const faq of FAQS) {
      if (includesAny(text, faq.keywords)) {
        const reply: ChatReply = {
          reply: faq.a,
          suggestions: SUGGESTIONS.slice(0, 3),
          actions: [],
        };
        return NextResponse.json(reply);
      }
    }

    // 6) Greeting
    if (includesAny(text, ["hello", "hi", "hey", "salam", "assalam"])) {
      const reply: ChatReply = {
        reply: `Welcome to ${CAFE.name}! I can recommend dishes by mood or budget, explain our sheesha and gaming policies, or help you book a table. What are you in the mood for?`,
        suggestions: SUGGESTIONS.slice(0, 4),
        actions: [],
      };
      return NextResponse.json(reply);
    }

    // 7) Fallback
    const reply: ChatReply = {
      reply:
        "I can help with menu recommendations, prices, timings, sheesha rules (18+), gaming rates, promo codes and reservations. Try one of these:",
      suggestions: SUGGESTIONS.slice(0, 4),
      actions: [{ type: "link", href: "/menu", label: "Browse menu" }],
    };
    return NextResponse.json(reply);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }
    console.error("chat error", err);
    return NextResponse.json(
      { error: "Chat service unavailable" },
      { status: 500 }
    );
  }
}
