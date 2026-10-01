import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

/** Admin: list orders with items, newest first. */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : {},
    include: {
      items: { include: { menuItem: { select: { title: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ orders });
}

/** Public order creation is handled by /api/checkout. */
export async function POST() {
  return NextResponse.json(
    { error: "Use /api/checkout to place an order" },
    { status: 405 }
  );
}
