import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const OrderPatch = z.object({
  status: z.enum(["PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"]),
  paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDED"]).optional(),
});

/** Admin: fetch one order with items. */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { menuItem: { select: { title: true } } } } },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

/** Admin: update order status / payment status. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = OrderPatch.parse(await req.json());
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: body.status as never,
        ...(body.paymentStatus ? { paymentStatus: body.paymentStatus as never } : {}),
      },
      include: { items: true },
    });
    return NextResponse.json({ order });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
