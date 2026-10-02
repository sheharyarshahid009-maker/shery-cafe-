"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, MessageCircle } from "lucide-react";

const AMOUNTS = [1000, 2000, 5000, 10000];
const WHATSAPP_NUMBER = "923396030012";

export default function GiftCardsPage() {
  const [form, setForm] = useState({
    buyerName: "",
    buyerPhone: "",
    recipientName: "",
    amount: AMOUNTS[1],
    message: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `*Gift Card Purchase - Shery Cafe*\n` +
      `-------------------------\n` +
      `From: ${form.buyerName}\n` +
      `Phone: ${form.buyerPhone}\n` +
      `To: ${form.recipientName}\n` +
      `Amount: Rs ${form.amount.toLocaleString()}\n` +
      (form.message ? `Message: ${form.message}\n` : "") +
      `-------------------------`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-gold-500/50";
  const labelCls =
    "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">
        Give The Gift Of Taste
      </p>
      <h1 className="section-title mt-1 text-center">Gift Cards 🎁</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        Perfect for birthdays, celebrations, or just because — give your loved
        ones the Shery Cafe experience!
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {AMOUNTS.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => setForm({ ...form, amount: amt })}
            className={`rounded-2xl border p-6 text-center transition ${
              form.amount === amt
                ? "border-gold-500 bg-gold-500/10"
                : "border-white/10 bg-white/5 hover:border-gold-500/30"
            }`}
          >
            <Gift className={`mx-auto h-8 w-8 ${form.amount === amt ? "text-gold-400" : "text-zinc-500"}`} />
            <p className={`mt-2 text-xl font-bold ${form.amount === amt ? "text-gold-400" : "text-zinc-100"}`}>
              Rs {amt.toLocaleString()}
            </p>
          </button>
        ))}
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="glass mx-auto mt-8 max-w-2xl space-y-5 p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Your Name</label>
            <input required value={form.buyerName} onChange={(e) => setForm({ ...form, buyerName: e.target.value })} placeholder="Ali Khan" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Your Phone</label>
            <input required value={form.buyerPhone} onChange={(e) => setForm({ ...form, buyerPhone: e.target.value })} placeholder="0339 1234567" className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Recipient's Name</label>
          <input required value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} placeholder="Sara Ahmed" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Personal Message (Optional)</label>
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Happy Birthday! Enjoy! 🎉" rows={3} className={inputCls} />
        </div>
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#1fb857]">
          <MessageCircle className="h-4 w-4" /> Buy Gift Card via WhatsApp
        </button>
        <p className="text-center text-xs text-zinc-500">
          We'll confirm payment and deliver the gift card digitally!
        </p>
      </motion.form>
    </div>
  );
}
