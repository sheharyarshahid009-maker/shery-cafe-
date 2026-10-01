"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";

const TIME_SLOTS = [
  "12:00–14:00",
  "14:00–16:00",
  "16:00–18:00",
  "18:00–20:00",
  "20:00–22:00",
  "22:00–00:00",
];

const AREAS = [
  { value: "TABLE", label: "Dining Table" },
  { value: "PS5", label: "PS5 Lounge" },
  { value: "VR", label: "VR Zone" },
  { value: "SNOOKER", label: "Snooker Table" },
  { value: "ARCADE", label: "Arcade Zone" },
] as const;

export default function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    timeSlot: TIME_SLOTS[3],
    guests: 2,
    areaType: "TABLE" as (typeof AREAS)[number]["value"],
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass mx-auto max-w-lg p-10 text-center"
      >
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-400" />
        <h2 className="text-2xl font-bold text-zinc-50">Reservation Received!</h2>
        <p className="mt-2 text-zinc-400">
          {form.name}, your {AREAS.find((a) => a.value === form.areaType)?.label}{" "}
          booking for {form.guests} guest{form.guests > 1 ? "s" : ""} on{" "}
          {form.date} ({form.timeSlot}) is confirmed. We will call {form.phone}{" "}
          shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="btn-ghost mt-6"
        >
          Make Another Booking
        </button>
      </motion.div>
    );
  }

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="glass mx-auto max-w-2xl space-y-5 p-6 md:p-8"
    >
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <CalendarCheck className="h-6 w-6 text-gold-400" /> Book Your Experience
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="bk-name">Full name</label>
          <input
            id="bk-name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="input-dark"
            placeholder="Ali Raza"
          />
        </div>
        <div>
          <label className="label" htmlFor="bk-phone">Phone</label>
          <input
            id="bk-phone"
            required
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="input-dark"
            placeholder="03xx xxxxxxx"
          />
        </div>
        <div>
          <label className="label" htmlFor="bk-date">Date</label>
          <input
            id="bk-date"
            type="date"
            required
            min={minDate}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className="input-dark"
          />
        </div>
        <div>
          <label className="label" htmlFor="bk-slot">Time slot</label>
          <select
            id="bk-slot"
            value={form.timeSlot}
            onChange={(e) => set("timeSlot", e.target.value)}
            className="input-dark"
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="bk-guests">Guests</label>
          <input
            id="bk-guests"
            type="number"
            min={1}
            max={30}
            required
            value={form.guests}
            onChange={(e) => set("guests", Number(e.target.value))}
            className="input-dark"
          />
        </div>
        <div>
          <label className="label" htmlFor="bk-area">Area</label>
          <select
            id="bk-area"
            value={form.areaType}
            onChange={(e) =>
              set("areaType", e.target.value as typeof form.areaType)
            }
            className="input-dark"
          >
            {AREAS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="bk-notes">
          Notes (optional)
        </label>
        <textarea
          id="bk-notes"
          rows={3}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          className="input-dark"
          placeholder="Birthday setup, window seat, gaming + food combo..."
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-gold w-full">
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Confirming...
          </>
        ) : (
          "Confirm Reservation"
        )}
      </button>
    </motion.form>
  );
}
