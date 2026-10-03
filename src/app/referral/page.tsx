"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check, Share2, Users } from "lucide-react";

const WHATSAPP_NUMBER = "923396030012";

function makeCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4) || "SHERY";
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${clean}-${num}`;
}

export default function ReferralPage() {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = makeCode(form.name);
    setCode(newCode);
    const msg =
      `*New Referral Registration 🎁*\n` +
      `-------------------------\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Referral Code: ${newCode}\n` +
      `-------------------------`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = () => {
    const msg =
      `🎁 Shery Cafe me mera referral code use karo: *${code}*\n\n` +
      `Tumhe 10% OFF milega aur mujhe bhi! 😍\n` +
      `Visit: https://shery-cafe.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-gold-500/50";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">Dost Lao, Inaam Pao</p>
      <h1 className="section-title mt-1 text-center">Referral Program 🎁</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">Apna code doston ko do — wo 10% OFF payein, aur aap bhi!</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { step: "1", title: "Code Banao", desc: "Neeche form bharo, apna code pao" },
          { step: "2", title: "Doston Ko Do", desc: "WhatsApp pe code share karo" },
          { step: "3", title: "Dono Jeeto", desc: "Dost 10% off, tumhe bhi 10% off!" },
        ].map((s, i) => (
          <motion.div key={s.step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass p-5 text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-gold-500 text-lg font-bold text-ink-950">{s.step}</div>
            <p className="mt-3 font-bold text-zinc-100">{s.title}</p>
            <p className="mt-1 text-xs text-zinc-500">{s.desc}</p>
          </motion.div>
        ))}
      </div>
      {!code ? (
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={generate} className="glass mt-6 space-y-5 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-50"><Users className="h-5 w-5 text-gold-400" /> Apna Referral Code Banao</h2>
          <div><label className={labelCls}>Your Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ali Khan" className={inputCls} /></div>
          <div><label className={labelCls}>Phone *</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XX XXXXXXX" className={inputCls} /></div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3.5 text-sm font-bold text-ink-950 transition hover:bg-gold-400">
            <Gift className="h-4 w-4" /> Generate My Code
          </button>
        </motion.form>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass mt-6 p-6 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Your Referral Code</p>
          <div className="mx-auto mt-3 flex max-w-xs items-center justify-between rounded-2xl border-2 border-dashed border-gold-500/50 bg-gold-500/10 px-6 py-4">
            <span className="font-mono text-2xl font-bold tracking-wider text-gold-400">{code}</span>
            <button onClick={copy} className="text-gold-400 hover:text-gold-300" aria-label="Copy code">{copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}</button>
          </div>
          {copied && <p className="mt-2 text-xs font-semibold text-green-400">Copied! ✅</p>}
          <button onClick={share} className="mx-auto mt-5 flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-500">
            <Share2 className="h-4 w-4" /> WhatsApp Pe Share Karo
          </button>
          <p className="mt-4 text-xs text-zinc-500">Jab dost ye code use karke aayega, dono ko 10% discount milega!</p>
          <button onClick={() => { setCode(""); setForm({ name: "", phone: "" }); }} className="mt-3 text-xs text-zinc-500 underline hover:text-zinc-300">Naya code banao</button>
        </motion.div>
      )}
      <p className="mt-6 text-center text-xs text-zinc-600">* Terms: Ek code ek dost ke liye. Discount dine-in pe valid hai.</p>
    </div>
  );
}
