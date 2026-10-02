"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper, MessageCircle } from "lucide-react";

const EVENT_TYPES = [
  "Birthday Party",
  "Anniversary",
  "Corporate Event",
  "Farewell",
  "Bridal/Baby Shower",
  "Other Celebration",
];

const TIME_SLOTS = [
  "12:00–15:00",
  "15:00–18:00",
  "18:00–21:00",
  "21:00–00:00",
];

const WHATSAPP_NUMBER = "923396030012";

export default function PartyBookingForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    eventType: EVENT_TYPES[0],
    date: "",
    timeSlot: TIME_SLOTS[2],
    guests: 10,
    notes: "",
  });

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const message =
      `*Party/Event Booking - Shery Cafe*\n` +
      `-------------------------\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Event: ${form.eventType}\n` +
      `Date: ${form.date}\n` +
      `Time: ${form.timeSlot}\n` +
      `Guests: ${form.guests}\n` +
      (form.notes ? `Notes: ${form.notes}\n` : "") +
      `-------------------------`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-gold-500/50";
  const labelCls =
    "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500";

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="glass mx-auto max-w-2xl space-y-5 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Your Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Muhammad Ali"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input
            required
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="0339 1234567"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Event Type</label>
          <select
            value={form.eventType}
            onChange={(e) => set("eventType", e.target.value)}
            className={inputCls}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t} className="bg-ink-900">
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Date</label>
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Time Slot</label>
          <select
            value={form.timeSlot}
            onChange={(e) => set("timeSlot", e.target.value)}
            className={inputCls}
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t} className="bg-ink-900">
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Number of Guests</label>
          <input
            required
            type="number"
            min={5}
            max={200}
            value={form.guests}
            onChange={(e) => set("guests", Number(e.target.value))}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Special Requirements</label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Birthday cake, decorations, special menu, sound system..."
          rows={3}
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#1fb857]"
      >
        <MessageCircle className="h-4 w-4" /> Send Booking via WhatsApp
      </button>

      <p className="flex items-center justify-center gap-2 text-center text-xs text-zinc-500">
        <PartyPopper className="h-3.5 w-3.5 text-gold-400" />
        Our team will confirm your booking on WhatsApp within 30 minutes!
      </p>
    </motion.form>
  );
}
