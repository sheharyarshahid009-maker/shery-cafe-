import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone")?.trim();
  if (!phone) {
    return NextResponse.json({ orders: [] });
  }
  const clean = phone.replace(/[\s-]/g, "");
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { customerPhone: phone },
        { customerPhone: clean },
        { customerPhone: { contains: clean.slice(-10) } },
      ],
    },
    include: {
      items: { include: { menuItem: { select: { title: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return NextResponse.json({ orders });
}
