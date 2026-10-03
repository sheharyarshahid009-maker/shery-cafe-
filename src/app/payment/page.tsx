"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Copy, Check, Send, Smartphone } from "lucide-react";

// ⚠️ Apne REAL account numbers yahan daalein!
const JAZZCASH_NUMBER = "03396030012";
const JAZZCASH_NAME = "Shery Cafe";
const EASYPAISA_NUMBER = "03396030012";
const EASYPAISA_NAME = "Shery Cafe";
const WHATSAPP_NUMBER = "923396030012";

export default function PaymentPage() {
  const [form, setForm] = useState({ name: "", phone: "", txnId: "", amount: "", method: "jazzcash" });
  const [copied, setCopied] = useState("");
  const [sent, setSent] = useState(false);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `*Payment Confirmation 💳*\n` +
      `-------------------------\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Method: ${form.method === "jazzcash" ? "JazzCash" : "EasyPaisa"}\n` +
      `Amount: Rs ${form.amount}\n` +
      `Transaction ID: ${form.txnId}\n` +
      `-------------------------`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-gold-500/50";
  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500";

  const methods = [
    { id: "jazzcash", label: "JazzCash", number: JAZZCASH_NUMBER, name: JAZZCASH_NAME, color: "bg-red-500" },
    { id: "easypaisa", label: "EasyPaisa", number: EASYPAISA_NUMBER, name: EASYPAISA_NAME, color: "bg-green-500" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">Pay Online</p>
      <h1 className="section-title mt-1 text-center">Online Payment 💳</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        JazzCash ya EasyPaisa se payment karein, phir neeche transaction ID bhej dein!
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {methods.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass p-5">
            <div className="flex items-center gap-3">
              <div className={`grid h-11 w-11 place-items-center rounded-full ${m.color}`}><Smartphone className="h-5 w-5 text-white" /></div>
              <p className="text-lg font-bold text-zinc-50">{m.label}</p>
            </div>
            <p className="mt-3 text-sm text-zinc-400">Account Title</p>
            <p className="font-semibold text-zinc-100">{m.name}</p>
            <p className="mt-2 text-sm text-zinc-400">Account Number</p>
            <div className="mt-1 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
              <span className="font-mono text-sm font-bold text-zinc-100">{m.number}</span>
              <button onClick={() => copy(m.number, m.id)} className="text-gold-400 transition hover:text-gold-300" aria-label="Copy">
                {copied === m.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={submit} className="glass mt-6 space-y-5 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-50"><Wallet className="h-5 w-5 text-gold-400" /> Payment Confirm Karein</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className={labelCls}>Your Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ali Khan" className={inputCls} /></div>
          <div><label className={labelCls}>Phone *</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XX XXXXXXX" className={inputCls} /></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Payment Method *</label>
            <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={`${inputCls} [&>option]:bg-ink-900`}>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
            </select>
          </div>
          <div><label className={labelCls}>Amount (Rs) *</label><input required type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="1500" className={inputCls} /></div>
        </div>
        <div>
          <label className={labelCls}>Transaction ID (TID) *</label>
          <input required value={form.txnId} onChange={(e) => setForm({ ...form, txnId: e.target.value })} placeholder="12345678901" className={inputCls} />
          <p className="mt-1.5 text-xs text-zinc-500">Payment ke baad jo SMS aaya, usme transaction ID likha hota hai.</p>
        </div>
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3.5 text-sm font-bold text-ink-950 transition hover:bg-gold-400">
          <Send className="h-4 w-4" /> Confirm Payment
        </button>
        {sent && <p className="text-center text-sm font-semibold text-green-400">✅ Bhej diya! Hum verify karke confirm karenge!</p>}
      </motion.form>
      <p className="mt-6 text-center text-xs text-zinc-600">⚠️ Note: Pehle payment karein, phir form bharein. Fake transaction ID pe order cancel ho jayega.</p>
    </div>
  );
}
