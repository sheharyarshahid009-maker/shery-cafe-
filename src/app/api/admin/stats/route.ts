import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

/** Admin dashboard analytics. */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    totalSales,
    ordersToday,
    pendingReservations,
    activeBookings,
    pendingOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalCents: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.reservation.count({ where: { status: "PENDING" } }),
    prisma.reservation.count({
      where: {
        status: "CONFIRMED",
        areaType: { in: ["PS5", "VR", "SNOOKER", "ARCADE"] },
        date: { gte: startOfDay },
      },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      customerName: true,
      totalCents: true,
      status: true,
      type: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    stats: {
      totalSalesCents: totalSales._sum.totalCents ?? 0,
      ordersToday,
      pendingReservations,
      activeBookings,
      pendingOrders,
    },
    recentOrders,
  });
}
