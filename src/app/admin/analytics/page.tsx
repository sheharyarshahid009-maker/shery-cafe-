"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, BarChart3, Star } from "lucide-react";
import { formatPKR } from "@/lib/format";

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalReservations: number;
  avgOrder: number;
  topItems: { title: string; count: number }[];
  recentOrders: { id: string; customerName: string; totalCents: number; status: string; createdAt: string }[];
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10"><p className="text-center text-zinc-500">Loading...</p></div>;
  if (!stats) return <div className="mx-auto max-w-7xl px-4 py-10"><p className="text-center text-zinc-500">Admin login required.</p></div>;

  const cards = [
    { label: "Total Revenue", value: formatPKR(stats.totalRevenue), icon: TrendingUp, color: "text-green-400" },
    { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "text-gold-400" },
    { label: "Reservations", value: stats.totalReservations.toString(), icon: Users, color: "text-blue-400" },
    { label: "Avg Order", value: formatPKR(stats.avgOrder), icon: BarChart3, color: "text-purple-400" },
  ];
  const maxCount = Math.max(...stats.topItems.map((i) => i.count), 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">Admin</p>
      <h1 className="section-title mt-1">Analytics 📊</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass p-5">
              <Icon className={`h-6 w-6 ${c.color}`} />
              <p className="mt-3 text-2xl font-bold text-zinc-50">{c.value}</p>
              <p className="text-xs text-zinc-500">{c.label}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-50"><Star className="h-5 w-5 text-gold-400" /> Top Selling Items</h2>
          <div className="mt-4 space-y-3">
            {stats.topItems.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-200">{item.title}</span>
                  <span className="text-zinc-500">{item.count} sold</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / maxCount) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-full rounded-full bg-gold-500" />
                </div>
              </div>
            ))}
            {stats.topItems.length === 0 && <p className="text-sm text-zinc-500">No orders yet!</p>}
          </div>
        </div>
        <div className="glass p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-50"><ShoppingBag className="h-5 w-5 text-gold-400" /> Recent Orders</h2>
          <div className="mt-4 space-y-2.5">
            {stats.recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{o.customerName}</p>
                  <p className="text-xs text-zinc-500">#{o.id.slice(-6).toUpperCase()} · {o.status}</p>
                </div>
                <span className="text-sm font-bold text-gold-400">{formatPKR(o.totalCents)}</span>
              </div>
            ))}
            {stats.recentOrders.length === 0 && <p className="text-sm text-zinc-500">No orders yet!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
