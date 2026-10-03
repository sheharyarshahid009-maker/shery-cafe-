"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Music, Send, ListMusic } from "lucide-react";

const WHATSAPP_NUMBER = "923396030012";

const RECENT = [
  { song: "Pasoori", artist: "Ali Sethi x Shae Gill", by: "Ahmed" },
  { song: "Kesariya", artist: "Arijit Singh", by: "Sara" },
  { song: "Levitating", artist: "Dua Lipa", by: "Usman" },
];

export default function SongRequestPage() {
  const [form, setForm] = useState({ song: "", artist: "", name: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `*Song Request 🎵*\n` +
      `-------------------------\n` +
      `Song: ${form.song}\n` +
      `Artist: ${form.artist || "-"}\n` +
      `Requested by: ${form.name}\n` +
      `-------------------------`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
    setSent(true);
    setForm({ song: "", artist: "", name: "" });
    setTimeout(() => setSent(false), 3000);
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-gold-500/50";
  const labelCls =
    "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">Your Playlist</p>
      <h1 className="section-title mt-1 text-center">Request a Song 🎵</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        Apna favourite gaana bajwao! Request bhejo, hum playlist me laga denge!
      </p>
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="glass mx-auto mt-8 max-w-xl space-y-5 p-6 sm:p-8"
      >
        <div>
          <label className={labelCls}>Song Name *</label>
          <input required value={form.song} onChange={(e) => setForm({ ...form, song: e.target.value })} placeholder="Pasoori" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Artist</label>
          <input value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} placeholder="Ali Sethi" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Your Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ali Khan" className={inputCls} />
        </div>
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3.5 text-sm font-bold text-ink-950 transition hover:bg-gold-400">
          <Send className="h-4 w-4" /> Send Request
        </button>
        {sent && (<p className="text-center text-sm font-semibold text-green-400">✅ Request bhej di! Jald bajega!</p>)}
      </motion.form>
      <div className="mt-10">
        <h2 className="flex items-center justify-center gap-2 text-lg font-bold text-zinc-100">
          <ListMusic className="h-5 w-5 text-gold-400" /> Recently Played
        </h2>
        <div className="mt-4 space-y-3">
          {RECENT.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass flex items-center gap-4 p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-500/15">
                <Music className="h-5 w-5 text-gold-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-zinc-100">{r.song}</p>
                <p className="truncate text-sm text-zinc-500">{r.artist}</p>
              </div>
              <span className="shrink-0 text-xs text-zinc-500">by {r.by}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
