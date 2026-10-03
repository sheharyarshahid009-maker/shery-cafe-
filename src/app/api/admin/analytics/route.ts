import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [orders, reservations, items] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.reservation.count(),
    prisma.orderItem.groupBy({
      by: ["menuItemId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 8,
    }),
  ]);
  const totalRevenue = orders.reduce((s, o) => s + o.totalCents, 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const menuIds = items.map((i) => i.menuItemId);
  const menus = await prisma.menuItem.findMany({ where: { id: { in: menuIds } }, select: { id: true, title: true } });
  const titleMap = Object.fromEntries(menus.map((m) => [m.id, m.title]));
  const topItems = items.map((i) => ({ title: titleMap[i.menuItemId] ?? "Unknown", count: i._sum.quantity ?? 0 }));
  const recentOrders = orders.slice(0, 8).map((o) => ({
    id: o.id, customerName: o.customerName, totalCents: o.totalCents, status: o.status, createdAt: o.createdAt,
  }));
  return NextResponse.json({ totalRevenue, totalOrders, totalReservations: reservations, avgOrder, topItems, recentOrders });
}
