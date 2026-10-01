import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const MenuItemPatch = z
  .object({
    title: z.string().min(2).max(120).optional(),
    description: z.string().min(5).max(2000).optional(),
    priceCents: z.number().int().positive().optional(),
    imageUrl: z.string().url().optional().or(z.literal("")).optional(),
    categoryId: z.string().cuid().optional(),
    tags: z.array(z.string()).optional(),
    spiceLevel: z.number().int().min(0).max(3).nullable().optional(),
    isAvailable: z.boolean().optional(),
    isAgeRestricted: z.boolean().optional(),
    customizationOptions: z.unknown().nullable().optional(),
  })
  .strict();

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const item = await prisma.menuItem.findUnique({
    where: { id: params.id },
    include: { category: { select: { name: true, slug: true } } },
  });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = MenuItemPatch.parse(await req.json());
    const { imageUrl, customizationOptions, ...rest } = body;
    const item = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        ...rest,
        ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}),
        ...(customizationOptions !== undefined
          ? { customizationOptions: (customizationOptions ?? null) as never }
          : {}),
      },
      include: { category: { select: { name: true, slug: true } } },
    });
    return NextResponse.json({ item });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 }
      );
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    await prisma.menuItem.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete (item may be referenced by an order)" },
      { status: 400 }
    );
  }
}
