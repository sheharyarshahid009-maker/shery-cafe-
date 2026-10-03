"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, CheckCircle, MessageSquareHeart } from "lucide-react";

const WHATSAPP_NUMBER = "923396030012";

const CATEGORIES = [
  { id: "food", label: "Food & Drinks 🍔" },
  { id: "service", label: "Service 🤵" },
  { id: "ambience", label: "Ambience ✨" },
  { id: "gaming", label: "Gaming Zone 🎮" },
];

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)} className="transition-transform hover:scale-125" aria-label={`${s} stars`}>
          <Star className={`h-8 w-8 transition-colors ${s <= value ? "fill-gold-400 text-gold-400" : "text-zinc-700 hover:text-zinc-500"}`} />
        </button>
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({ food: 0, service: 0, ambience: 0, gaming: 0 });
  const [form, setForm] = useState({ name: "", comment: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const avg = Object.values(ratings).filter((v) => v > 0);
  const avgScore = avg.length ? (avg.reduce((a, b) => a + b, 0) / avg.length).toFixed(1) : "0.0";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (avg.length === 0) {
      setError("Kam se kam ek category me stars dein! ⭐");
      return;
    }
    setError("");
    const lines = CATEGORIES.map((c) => `${c.label}: ${ratings[c.id] || "-"}/5`).join("\n");
    const msg =
      `*Customer Feedback ⭐*\n` +
      `-------------------------\n` +
      `${lines}\n` +
      `Average: ${avgScore}/5\n` +
      `-------------------------\n` +
      `Name: ${form.name || "-"}\n` +
      `Comment: ${form.comment || "-"}\n` +
      `-------------------------`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
  };

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-gold-500/50";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500";

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-10 text-center">
          <CheckCircle className="mx-auto h-14 w-14 text-green-400" />
          <h1 className="section-title mt-4">Shukriya! 🙏</h1>
          <p className="mt-3 text-sm text-zinc-400">Apki feedback mil gayi! Apki raaye se hum behtar bante hain.</p>
          <p className="mt-2 text-sm text-zinc-400">Overall rating: <span className="font-bold text-gold-400">{avgScore}/5 ⭐</span></p>
          <button onClick={() => { setSent(false); setRatings({ food: 0, service: 0, ambience: 0, gaming: 0 }); setForm({ name: "", comment: "" }); }} className="btn-ghost mt-6">Ek aur feedback dein</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">We Value You</p>
      <h1 className="section-title mt-1 text-center">Share Your Experience ⭐</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">Apka experience kaisa raha? Rate karein — apki raaye hamare liye qeemti hai!</p>
      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="glass mt-8 space-y-6 p-6 sm:p-8">
        {CATEGORIES.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-sm font-semibold text-zinc-200">{c.label}</p>
            <Stars value={ratings[c.id]} onChange={(v) => setRatings({ ...ratings, [c.id]: v })} />
          </motion.div>
        ))}
        {avg.length > 0 && (<p className="text-center text-sm text-zinc-400">Overall: <span className="font-bold text-gold-400">{avgScore}/5 ⭐</span></p>)}
        <div><label className={labelCls}>Your Name (optional)</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ali Khan" className={inputCls} /></div>
        <div><label className={labelCls}>Comments (optional)</label><textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Kya acha laga? Kya behtar ho sakta hai?" rows={3} className={`${inputCls} resize-none`} /></div>
        {error && <p className="text-center text-sm font-semibold text-red-400">{error}</p>}
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3.5 text-sm font-bold text-ink-950 transition hover:bg-gold-400">
          <Send className="h-4 w-4" /> Submit Feedback
        </button>
      </motion.form>
      <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-zinc-600"><MessageSquareHeart className="h-3.5 w-3.5" /> Har feedback personally parha jata hai!</p>
    </div>
  );
}
