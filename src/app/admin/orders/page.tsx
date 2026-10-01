"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminNav from "@/components/AdminNav";
import StatusPill from "@/components/StatusPill";
import { formatPKR } from "@/lib/format";
import clsx from "clsx";

const STATUSES = ["PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"] as const;

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  type: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  totalCents: number;
  promoCode?: string | null;
  address?: string | null;
  tableNumber?: string | null;
  notes?: string | null;
  createdAt: string;
  items: { id: string; quantity: number; unitPriceCents: number; menuItem: { title: string } }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch(
      filter === "all" ? "/api/orders" : `/api/orders?status=${filter}`
    );
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  };

  const markPaid = async (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: order.status,
        paymentStatus: order.paymentStatus === "PAID" ? "UNPAID" : "PAID",
      }),
    });
    await load();
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 p-6 md:p-10">
        <h1 className="section-title">Orders</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                filter === s
                  ? "bg-gold-500 text-ink-950"
                  : "border border-white/10 bg-white/5 text-zinc-400 hover:border-gold-500/40"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          </div>
        ) : orders.length === 0 ? (
          <p className="py-16 text-center text-zinc-500">No orders found.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="glass p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-zinc-50">
                      {o.customerName}{" "}
                      <span className="font-mono text-xs font-normal text-zinc-500">
                        #{o.id.slice(0, 8)}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      {o.customerPhone} · {o.type} · {o.paymentMethod} ·{" "}
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                    <ul className="mt-2 space-y-0.5 text-sm text-zinc-300">
                      {o.items.map((it) => (
                        <li key={it.id}>
                          {it.quantity}× {it.menuItem.title} —{" "}
                          {formatPKR(it.unitPriceCents * it.quantity)}
                        </li>
                      ))}
                    </ul>
                    {o.notes && (
                      <p className="mt-1 text-xs text-zinc-500">Note: {o.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gold-400">
                      {formatPKR(o.totalCents)}
                    </p>
                    <div className="mt-1 flex items-center justify-end gap-2">
                      <StatusPill status={o.status} />
                      <button
                        onClick={() => markPaid(o.id)}
                        className={clsx(
                          "rounded-full px-2.5 py-1 text-[11px] font-bold",
                          o.paymentStatus === "PAID"
                            ? "bg-green-500/15 text-green-300"
                            : "bg-white/10 text-zinc-400"
                        )}
                        title="Toggle paid"
                      >
                        {o.paymentStatus}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(o.id, s)}
                      disabled={o.status === s}
                      className={clsx(
                        "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                        o.status === s
                          ? "bg-gold-500 text-ink-950"
                          : "bg-white/5 text-zinc-400 hover:bg-white/10"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
