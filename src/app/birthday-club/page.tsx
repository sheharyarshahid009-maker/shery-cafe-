"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cake, Gift, PartyPopper, Music, CheckCircle, Sparkles } from "lucide-react";

const WHATSAPP_NUMBER = "923396030012";

const PERKS = [
  { icon: Cake, title: "Complimentary Dessert", desc: "Apke birthday pe humari taraf se signature dessert — bilkul free!" },
  { icon: Music, title: "Birthday Song", desc: "Hamari team apke liye special birthday song gayegi!" },
  { icon: PartyPopper, title: "Table Decoration", desc: "Apki table ko birthday theme se sajaya jayega!" },
  { icon: Gift, title: "Surprise Gift", desc: "Shery Cafe ki taraf se ek chota sa surprise gift!" },
  { icon: Sparkles, title: "VIP Treatment", desc: "Birthday week me 15% off on your entire bill!" },
];

export default function BirthdayClubPage() {
  const [form, setForm] = useState({ name: "", phone: "", dob: "" });
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `*Birthday Club Registration 🎂*\n` +
      `-------------------------\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Birthday: ${form.dob}\n` +
      `-------------------------`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setDone(true);
  };

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-gold-500/50";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">Celebrate With Us</p>
      <h1 className="section-title mt-1 text-center">Birthday Club 🎂</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">Apni birthday register karein — us din Shery Cafe apke liye kuch khaas karega!</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {PERKS.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div key={p.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass flex items-start gap-4 p-5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-500/15"><Icon className="h-5 w-5 text-gold-400" /></div>
              <div><p className="font-bold text-zinc-100">{p.title}</p><p className="mt-1 text-xs text-zinc-500">{p.desc}</p></div>
            </motion.div>
          );
        })}
      </div>
      {!done ? (
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="glass mt-6 space-y-5 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-50"><Cake className="h-5 w-5 text-gold-400" /> Join the Club — It's Free!</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><label className={labelCls}>Your Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ali Khan" className={inputCls} /></div>
            <div><label className={labelCls}>Phone *</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XX XXXXXXX" className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Date of Birth *</label><input required type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className={`${inputCls} [color-scheme:dark]`} /></div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3.5 text-sm font-bold text-ink-950 transition hover:bg-gold-400">
            <Cake className="h-4 w-4" /> Join Birthday Club
          </button>
          <p className="text-center text-xs text-zinc-600">Birthday se 3 din pehle hum apko remind karenge! 🎉</p>
        </motion.form>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass mt-6 p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
          <h2 className="mt-4 text-xl font-bold text-zinc-50">Welcome to the Club! 🎉</h2>
          <p className="mt-2 text-sm text-zinc-400">Apki birthday <span className="font-bold text-gold-400">{form.dob}</span> register ho gayi!</p>
          <p className="mt-1 text-sm text-zinc-400">Us din ka intezaar karein — kuch khaas hone wala hai! 🎂</p>
        </motion.div>
      )}
    </div>
  );
}
