"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PackageSearch, Phone, Clock, CheckCircle2, CookingPot, Bike, XCircle } from "lucide-react";
import { formatPKR } from "@/lib/format";

type OrderInfo = {
  id: string;
  status: string;
  totalCents: number;
  createdAt: string;
  items: { quantity: number; menuItem: { title: string } }[];
};

const STEPS = ["PENDING", "PREPARING", "READY", "DELIVERED"];

const STEP_INFO: Record<string, { label: string; icon: any; desc: string }> = {
  PENDING: { label: "Order Mila", icon: Clock, desc: "Apka order receive ho gaya!" },
  PREPARING: { label: "Ban Raha Hai", icon: CookingPot, desc: "Kitchen me prepare ho raha hai 👨‍🍳" },
  READY: { label: "Ready!", icon: CheckCircle2, desc: "Apka order ready hai! 🎉" },
  DELIVERED: { label: "Delivered", icon: Bike, desc: "Enjoy karein! 😋" },
  CANCELLED: { label: "Cancelled", icon: XCircle, desc: "Order cancel ho gaya" },
};

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  const getStepIndex = (status: string) => {
    if (status === "CANCELLED") return -1;
    return STEPS.indexOf(status);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">Live Updates</p>
      <h1 className="section-title mt-1 text-center">Track Your Order 📦</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        Apna phone number dalein jo order karte waqt diya tha!
      </p>
      <form onSubmit={search} className="glass mx-auto mt-8 flex max-w-md gap-2 p-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Phone className="h-4 w-4 shrink-0 text-zinc-500" />
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0339 1234567" className="w-full bg-transparent py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none" />
        </div>
        <button type="submit" disabled={loading} className="btn-gold shrink-0 !px-5">
          <PackageSearch className="h-4 w-4" />{loading ? "..." : "Track"}
        </button>
      </form>
      <div className="mt-8 space-y-5">
        {searched && !loading && orders.length === 0 && (
          <p className="text-center text-sm text-zinc-500">Is number pe koi order nahi mila. Number check karein!</p>
        )}
        {orders.map((order, oi) => {
          const stepIdx = getStepIndex(order.status);
          const isCancelled = order.status === "CANCELLED";
          return (
            <motion.div key={order.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: oi * 0.1 }} className="glass p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-100">Order #{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString("en-PK")}</p>
                </div>
                <span className="font-bold text-gold-400">{formatPKR(order.totalCents)}</span>
              </div>
              <div className="mt-3 space-y-1">
                {order.items.map((it, i) => (
                  <p key={i} className="text-sm text-zinc-400">{it.quantity}x {it.menuItem.title}</p>
                ))}
              </div>
              {!isCancelled ? (
                <div className="mt-5">
                  <div className="flex items-center">
                    {STEPS.map((s, i) => {
                      const info = STEP_INFO[s];
                      const Icon = info.icon;
                      const active = i <= stepIdx;
                      return (
                        <div key={s} className="flex flex-1 items-center last:flex-none">
                          <div className="flex flex-col items-center">
                            <div className={`grid h-10 w-10 place-items-center rounded-full border-2 transition ${active ? "border-gold-500 bg-gold-500/15 text-gold-400" : "border-white/10 bg-white/5 text-zinc-600"}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <p className={`mt-1.5 text-[10px] font-semibold ${active ? "text-gold-400" : "text-zinc-600"}`}>{info.label}</p>
                          </div>
                          {i < STEPS.length - 1 && (<div className={`mx-1 mb-5 h-0.5 flex-1 ${i < stepIdx ? "bg-gold-500" : "bg-white/10"}`} />)}
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-center text-sm text-zinc-400">{STEP_INFO[order.status]?.desc}</p>
                </div>
              ) : (
                <p className="mt-4 flex items-center justify-center gap-2 text-sm text-red-400"><XCircle className="h-4 w-4" /> Ye order cancel ho gaya hai</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
