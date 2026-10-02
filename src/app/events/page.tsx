"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import Link from "next/link";

// Yahan apne events add/edit karo!
const EVENTS = [
  {
    id: 1,
    title: "Live Acoustic Night",
    date: "2026-10-10",
    time: "8:00 PM – 11:00 PM",
    description: "Soulful acoustic performances with dinner and sheesha. Free entry!",
    tag: "Music",
  },
  {
    id: 2,
    title: "Karaoke Night",
    date: "2026-10-17",
    time: "7:00 PM – 12:00 AM",
    description: "Grab the mic and sing your heart out! Prizes for best performance.",
    tag: "Fun",
  },
  {
    id: 3,
    title: "PS5 Tournament",
    date: "2026-10-24",
    time: "4:00 PM – 10:00 PM",
    description: "FIFA & Tekken championship. Winner takes home Rs 10,000!",
    tag: "Gaming",
  },
  {
    id: 4,
    title: "Sufi Night",
    date: "2026-10-31",
    time: "8:00 PM – 11:30 PM",
    description: "An evening of soulful Sufi music under the stars.",
    tag: "Music",
  },
];

const TAG_COLORS: Record<string, string> = {
  Music: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Fun: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  Gaming: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleString("en", { month: "short" }),
    weekday: d.toLocaleString("en", { weekday: "long" }),
  };
}

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">
        What's On
      </p>
      <h1 className="section-title mt-1 text-center">Upcoming Events</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        Live music, karaoke, gaming tournaments and more — there's always
        something happening at Shery Cafe!
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {EVENTS.map((event, i) => {
          const { day, month, weekday } = formatDate(event.date);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass flex gap-5 p-6"
            >
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10">
                <span className="text-2xl font-bold text-gold-400">{day}</span>
                <span className="text-xs font-semibold uppercase text-zinc-400">
                  {month}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      TAG_COLORS[event.tag] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
                    }`}
                  >
                    {event.tag}
                  </span>
                  <span className="text-xs text-zinc-500">{weekday}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-zinc-50">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">{event.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold-400" /> {event.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gold-400" /> Shery Cafe
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 rounded-3xl border border-white/10 bg-ink-900/60 p-8 text-center"
      >
        <Ticket className="mx-auto h-8 w-8 text-gold-400" />
        <h2 className="section-title mt-3">Want to attend?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
          Reserve your table for any event — seats fill up fast on event nights!
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/book" className="btn-gold">
            <CalendarDays className="h-4 w-4" /> Reserve a Table
          </Link>
          <Link href="/party" className="btn-ghost">
            Host Your Own Event
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
