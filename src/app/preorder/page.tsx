"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Clock, CheckCircle, Timer } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "923396030012";

const SLOTS = [
  { label: "15 min", mins: 15 },
  { label: "30 min", mins: 30 },
  { label: "45 min", mins: 45 },
  { label: "1 hour", mins: 60 },
  { label: "2 hours", mins: 120 },
];

function pickupTime(mins: number): string {
  const d = new Date(Date.now() + mins * 60000);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 === 0 ? 12 : h % 12;
  return `${h}:${m} ${suffix}`;
}

export default function PreorderPage() {
  const [slot, setSlot] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [done, setDone] = useState(false);

  const confirm = (e: React.FormEvent) => {
    e.preventDefault();
    const time = pickupTime(SLOTS[slot].mins);
    try {
      localStorage.setItem("shery-preorder", JSON.stringify({ time, name: form.name }));
    } catch {}
    const msg =
      `*Pre-Order Pickup 🛍️*\n` +
      `-------------------------\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Pickup Time: ${time}\n` +
      `-------------------------\n` +
      `Me website se order kar raha hun, pickup ke liye ready rakhna!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setDone(true);
  };

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-gold-500/50";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">Zero Wait</p>
      <h1 className="section-title mt-1 text-center">Pre-Order Pickup 🛍️</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">Ghar se order karo, cafe pohanchte hi khana ready! Koi wait nahi!</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Clock, title: "Time Chuno", desc: "Kab pickup karna hai?" },
          { icon: ShoppingBag, title: "Order Karo", desc: "Menu se items select karo" },
          { icon: CheckCircle, title: "Pickup Karo", desc: "Ready milega, wait zero!" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass p-5 text-center">
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-gold-500/15"><Icon className="h-5 w-5 text-gold-400" /></div>
              <p className="mt-3 font-bold text-zinc-100">{s.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
      {!done ? (
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={confirm} className="glass mt-6 space-y-5 p-6 sm:p-8">
          <div>
            <label className={labelCls}>Pickup Time Chuno *</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {SLOTS.map((s, i) => (
                <button key={s.label} type="button" onClick={() => setSlot(i)} className={`rounded-xl border px-3 py-3 text-center transition ${slot === i ? "border-gold-500 bg-gold-500/15 text-gold-400" : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/25"}`}>
                  <p className="flex items-center justify-center gap-1 text-sm font-bold"><Timer className="h-3.5 w-3.5" /> {s.label}</p>
                  <p className="mt-0.5 text-[11px] opacity-70">{pickupTime(s.mins)}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label className={labelCls}>Your Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ali Khan" className={inputCls} /></div>
            <div><label className={labelCls}>Phone *</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XX XXXXXXX" className={inputCls} /></div>
          </div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3.5 text-sm font-bold text-ink-950 transition hover:bg-gold-400">
            <ShoppingBag className="h-4 w-4" /> Confirm & Order Now
          </button>
        </motion.form>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass mt-6 p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
          <h2 className="mt-4 text-xl font-bold text-zinc-50">Pre-Order Noted! ✅</h2>
          <p className="mt-2 text-sm text-zinc-400">Pickup time: <span className="font-bold text-gold-400">{pickupTime(SLOTS[slot].mins)}</span></p>
          <p className="mt-1 text-sm text-zinc-400">Ab menu se apne items order karo!</p>
          <Link href="/menu" className="btn-gold mt-6 inline-flex"><ShoppingBag className="h-5 w-5" /> Go to Menu</Link>
        </motion.div>
      )}
    </div>
  );
}
