import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const PromoInput = z.object({
  code: z.string().min(3).max(30).regex(/^[A-Z0-9]+$/),
  percentOff: z.number().int().min(1).max(100),
  maxDiscountCents: z.number().int().positive().nullable().optional(),
  minOrderCents: z.number().int().min(0).nullable().optional(),
  active: z.boolean().default(true),
  expiresAt: z.string().datetime().nullable().optional(),
});

const BannerInput = z.object({
  title: z.string().min(2).max(120),
  subtitle: z.string().max(300).optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  ctaText: z.string().max(40).optional().or(z.literal("")),
  ctaHref: z.string().max(120).optional().or(z.literal("")),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

const BannerPatch = BannerInput.partial().strict();

// Happy hour time locks: code -> allowed time window (24h, Pakistan time UTC+5)
const HAPPY_HOUR_LOCKS: Record<string, { start: number; end: number; label: string }> = {
  HAPPY20: { start: 16, end: 19, label: "4 PM – 7 PM" },
  LATE15: { start: 0, end: 2, label: "12 AM – 2 AM" },
};

function pakistanHour(): number {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const pkt = new Date(utc + 5 * 3600000);
  return pkt.getHours() + pkt.getMinutes() / 60;
}

/** Public: validate a promo code at checkout. Admin: list all promos. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (code) {
    const promo = await prisma.promoCode.findUnique({ where: { code } });
    if (!promo || !promo.active)
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
    if (promo.expiresAt && promo.expiresAt < new Date())
      return NextResponse.json({ error: "Promo code expired" }, { status: 400 });
    // Time-lock check for happy hour codes
    const lock = HAPPY_HOUR_LOCKS[promo.code];
    if (lock) {
      const h = pakistanHour();
      if (h < lock.start || h >= lock.end) {
        return NextResponse.json(
          { error: `Ye code sirf Happy Hours me valid hai (${lock.label})` },
          { status: 400 }
        );
      }
    }
    return NextResponse.json({ promo });
  }
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const promos = await prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ promos, banners });
}

/** Admin: create promo code or banner. Body: { kind: "promo"|"banner", ...fields } */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const raw = (await req.json()) as { kind?: string };
    if (raw.kind === "banner") {
      const body = BannerInput.parse(raw);
      const banner = await prisma.banner.create({
        data: {
          title: body.title,
          subtitle: body.subtitle || null,
          imageUrl: body.imageUrl || null,
          ctaText: body.ctaText || null,
          ctaHref: body.ctaHref || null,
          active: body.active,
          sortOrder: body.sortOrder,
        },
      });
      return NextResponse.json({ banner }, { status: 201 });
    }
    const body = PromoInput.parse(raw);
    const promo = await prisma.promoCode.create({
      data: {
        code: body.code,
        percentOff: body.percentOff,
        maxDiscountCents: body.maxDiscountCents ?? null,
        minOrderCents: body.minOrderCents ?? 0,
        active: body.active,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });
    return NextResponse.json({ promo }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 }
      );
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

/** Admin: update/delete promo or banner. Query: ?kind=promo|banner&id=... */
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    if (kind === "banner") {
      const body = BannerPatch.parse(await req.json());
      const banner = await prisma.banner.update({ where: { id }, data: body });
      return NextResponse.json({ banner });
    }
    const body = PromoInput.partial().parse(await req.json());
    const promo = await prisma.promoCode.update({ where: { id }, data: body });
    return NextResponse.json({ promo });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (kind === "banner") {
    await prisma.banner.delete({ where: { id } });
  } else {
    await prisma.promoCode.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
