"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import Link from "next/link";

type Deal = { start: number; end: number; title: string; desc: string; code: string };

// Yahan apne happy hour timings aur deals change karo!
const HAPPY_HOURS: Deal[] = [
  { start: 16, end: 19, title: "Evening Happy Hours ☕", desc: "20% OFF on all coffee & desserts!", code: "HAPPY20" },
  { start: 0, end: 2, title: "Late Night Deal 🌙", desc: "15% OFF on sheesha!", code: "LATE15" },
];

function getStatus(now: Date): { active: Deal | null; next: Deal | null; minsLeft: number } {
  const h = now.getHours() + now.getMinutes() / 60;
  for (const d of HAPPY_HOURS) {
    if (h >= d.start && h < d.end) {
      return { active: d, next: null, minsLeft: Math.round((d.end - h) * 60) };
    }
  }
  let next: Deal | null = null;
  let minDiff = 24;
  for (const d of HAPPY_HOURS) {
    let diff = d.start - h;
    if (diff <= 0) diff += 24;
    if (diff < minDiff) { minDiff = diff; next = d; }
  }
  return { active: null, next, minsLeft: Math.round(minDiff * 60) };
}

function fmtHour(h: number): string {
  const hr = h % 24;
  const suffix = hr >= 12 ? "PM" : "AM";
  const h12 = hr % 12 === 0 ? 12 : hr % 12;
  return `${h12} ${suffix}`;
}

export default function HappyHourBanner() {
  const [status, setStatus] = useState<{ active: Deal | null; next: Deal | null; minsLeft: number } | null>(null);

  useEffect(() => {
    setStatus(getStatus(new Date()));
    const t = setInterval(() => setStatus(getStatus(new Date())), 60000);
    return () => clearInterval(t);
  }, []);

  if (!status) return null;

  if (status.active) {
    const d = status.active;
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-gold-500/50 bg-gradient-to-r from-gold-500/25 via-gold-500/10 to-transparent p-8 sm:p-10">
          <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            LIVE NOW
          </div>
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-400"><Zap className="h-4 w-4" /> Limited Time</p>
              <h2 className="section-title mt-2">{d.title}</h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-300">{d.desc}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400"><Clock className="h-3.5 w-3.5" /> Khatam hone me {status.minsLeft} min baaki!</p>
              <p className="mt-3 inline-block rounded-lg border border-dashed border-gold-500/50 bg-ink-950/50 px-4 py-2 font-mono text-sm font-bold text-gold-400">Code: {d.code}</p>
            </div>
            <Link href="/menu" className="btn-gold shrink-0"><Zap className="h-5 w-5" /> Order Now</Link>
          </div>
        </motion.div>
      </section>
    );
  }

  if (status.next) {
    const d = status.next;
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3.5 text-center">
          <Clock className="h-4 w-4 shrink-0 text-gold-400" />
          <p className="text-xs text-zinc-400 sm:text-sm">⏰ <span className="font-semibold text-zinc-200">{d.title}</span> — {fmtHour(d.start)} se {fmtHour(d.end)} · {d.desc}</p>
        </div>
      </section>
    );
  }
  return null;
}
