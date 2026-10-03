"use client";

import { motion } from "framer-motion";
import { Star, Gift, Crown, MessageCircle, Coffee, Cake } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "923396030012";

const TIERS = [
  {
    name: "Silver", icon: Star, points: "0 - 499",
    color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/30",
    perks: ["Har Rs 100 pe 10 points", "Birthday pe free dessert"],
  },
  {
    name: "Gold", icon: Crown, points: "500 - 1499",
    color: "text-gold-400", bg: "bg-gold-500/10", border: "border-gold-500/30",
    perks: ["Har Rs 100 pe 15 points", "Har 500 points pe Rs 500 off", "Priority booking"],
  },
  {
    name: "Platinum", icon: Gift, points: "1500+",
    color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30",
    perks: ["Har Rs 100 pe 20 points", "Har 500 points pe Rs 750 off", "Free monthly sheesha", "VIP event invites"],
  },
];

const REWARDS = [
  { points: 100, reward: "Free Coffee", icon: Coffee },
  { points: 250, reward: "Free Dessert", icon: Cake },
  { points: 500, reward: "Rs 500 Off", icon: Gift },
  { points: 1000, reward: "Free Meal for 2", icon: Star },
];

export default function LoyaltyPage() {
  const checkPoints = () => {
    const msg = `*Loyalty Points Check*\n\nAssalam-o-Alaikum! Mere loyalty points check karein.\nPhone: `;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">Rewards Program</p>
      <h1 className="section-title mt-1 text-center">Shery Rewards ⭐</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        Jitna khao, utne points! Points jama karo aur free food, discounts aur VIP perks pao!
      </p>
      <div className="mt-6 text-center">
        <button onClick={checkPoints} className="btn-gold">
          <MessageCircle className="h-4 w-4" /> Mere Points Check Karo
        </button>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { step: "1", title: "Order Karo", desc: "Website ya cafe me order karo" },
          { step: "2", title: "Points Pao", desc: "Har Rs 100 pe 10-20 points" },
          { step: "3", title: "Redeem Karo", desc: "Points se free food pao!" },
        ].map((s, i) => (
          <motion.div key={s.step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass p-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-500/15 text-xl font-bold text-gold-400">{s.step}</div>
            <p className="mt-3 font-bold text-zinc-100">{s.title}</p>
            <p className="mt-1 text-sm text-zinc-400">{s.desc}</p>
          </motion.div>
        ))}
      </div>
      <h2 className="section-title mt-14 text-center">Membership Tiers</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {TIERS.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`rounded-3xl border ${t.border} ${t.bg} p-6`}>
              <Icon className={`h-8 w-8 ${t.color}`} />
              <h3 className="mt-3 text-xl font-bold text-zinc-50">{t.name}</h3>
              <p className={`text-sm font-semibold ${t.color}`}>{t.points} points</p>
              <ul className="mt-4 space-y-2">
                {t.perks.map((p, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Star className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${t.color}`} />{p}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
      <h2 className="section-title mt-14 text-center">Redeem Rewards</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {REWARDS.map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.div key={r.points} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass p-5 text-center">
              <Icon className="mx-auto h-7 w-7 text-gold-400" />
              <p className="mt-2 text-lg font-bold text-gold-400">{r.points}</p>
              <p className="text-xs text-zinc-500">points</p>
              <p className="mt-1 text-sm font-semibold text-zinc-100">{r.reward}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-12 rounded-3xl border border-white/10 bg-ink-900/60 p-8 text-center">
        <h2 className="section-title">Join Karna Bilkul Free Hai!</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">Bas ek baar order karo aur tumhara loyalty account ban jayega!</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/menu" className="btn-gold">Order Karo & Points Pao</Link>
        </div>
      </div>
    </div>
  );
}
