import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const MenuItemInput = z.object({
  title: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().min(5).max(2000),
  priceCents: z.number().int().positive(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().cuid(),
  tags: z.array(z.string()).default([]),
  spiceLevel: z.number().int().min(0).max(3).nullable().optional(),
  isAvailable: z.boolean().default(true),
  isAgeRestricted: z.boolean().default(false),
  customizationOptions: z.unknown().nullable().optional(),
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Public: list menu items, optionally filtered by category slug / search / availability. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const available = searchParams.get("available");

  const items = await prisma.menuItem.findMany({
    where: {
      ...(category && category !== "all"
        ? { category: { slug: category } }
        : {}),
      ...(available === "true" ? { isAvailable: true } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: [{ category: { sortOrder: "asc" } }, { title: "asc" }],
  });
  return NextResponse.json({ items });
}

/** Admin: create a menu item. */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = MenuItemInput.parse(await req.json());
    const slug = body.slug ?? slugify(body.title);
    const item = await prisma.menuItem.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        priceCents: body.priceCents,
        imageUrl: body.imageUrl || null,
        categoryId: body.categoryId,
        tags: body.tags,
        spiceLevel: body.spiceLevel ?? null,
        isAvailable: body.isAvailable,
        isAgeRestricted: body.isAgeRestricted,
        customizationOptions: (body.customizationOptions ?? null) as never,
      },
      include: { category: { select: { name: true, slug: true } } },
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 }
      );
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
