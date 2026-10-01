"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarCheck, Flame, ShoppingBag, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1800&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/80 to-ink-950" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mb-6 flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold-400"
        >
          <Sparkles className="h-4 w-4" />
          Premium Cafe & Lounge
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl"
        >
          Shery Cafe: <span className="gold-text">Taste</span>,{" "}
          <span className="gold-text">Vibe</span> &{" "}
          <span className="gold-text">Entertainment</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-2xl text-base text-zinc-300 md:text-lg"
        >
          Gourmet food, specialty coffee, a premium sheesha lounge and a
          full gaming arena — all under one roof, open till 2 AM.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/menu" className="btn-gold">
            <ShoppingBag className="h-5 w-5" /> Order Online
          </Link>
          <Link href="/book" className="btn-ghost">
            <CalendarCheck className="h-5 w-5" /> Reserve a Table
          </Link>
          <Link href="/menu" className="btn-ghost">
            <Flame className="h-5 w-5" /> Explore Menu
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
