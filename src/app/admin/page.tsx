"use client";

import { useEffect, useState } from "react";
import {
  BadgeDollarSign,
  CalendarCheck,
  Gamepad2,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import AdminNav from "@/components/AdminNav";
import StatCard from "@/components/StatCard";
import StatusPill from "@/components/StatusPill";
import { formatPKR } from "@/lib/format";

interface Stats {
  totalSalesCents: number;
  ordersToday: number;
  pendingReservations: number;
  activeBookings: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<
    { id: string; customerName: string; totalCents: number; status: string; type: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setRecent(d.recentOrders ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 p-6 md:p-10">
        <h1 className="section-title">Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Live pulse of Shery Cafe.
        </p>

        {!stats ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Sales"
                value={formatPKR(stats.totalSalesCents)}
                icon={BadgeDollarSign}
                accent
              />
              <StatCard
                label="Orders Today"
                value={String(stats.ordersToday)}
                icon={ShoppingBag}
              />
              <StatCard
                label="Pending Reservations"
                value={String(stats.pendingReservations)}
                icon={CalendarCheck}
              />
              <StatCard
                label="Active Gaming Bookings"
                value={String(stats.activeBookings)}
                icon={Gamepad2}
              />
            </div>

            <div className="glass mt-8 p-6">
              <h2 className="mb-4 font-bold">Recent Orders</h2>
              {recent.length === 0 ? (
                <p className="text-sm text-zinc-500">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
                        <th className="py-2 pr-4">ID</th>
                        <th className="py-2 pr-4">Customer</th>
                        <th className="py-2 pr-4">Type</th>
                        <th className="py-2 pr-4">Total</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((o) => (
                        <tr key={o.id} className="border-b border-white/5">
                          <td className="py-2.5 pr-4 font-mono text-xs text-zinc-500">
                            {o.id.slice(0, 8)}
                          </td>
                          <td className="py-2.5 pr-4 text-zinc-200">{o.customerName}</td>
                          <td className="py-2.5 pr-4 text-zinc-400">{o.type}</td>
                          <td className="py-2.5 pr-4 font-semibold text-gold-400">
                            {formatPKR(o.totalCents)}
                          </td>
                          <td className="py-2.5">
                            <StatusPill status={o.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
