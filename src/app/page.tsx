"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Coffee,
  Gamepad2,
  MapPin,
  Phone,
  Quote,
  ShoppingBag,
  Star,
  CalendarCheck,
} from "lucide-react";
import Hero from "@/components/Hero";
import { useEffect, useState } from "react";
import type { MenuItemDTO } from "@/components/MenuCard";
import { formatPKR } from "@/lib/format";

const REVIEWS = [
  {
    name: "Ayesha K.",
    text: "The Spanish latte is genuinely the best I have had in Karachi. The lounge vibe at night is unmatched.",
    rating: 5,
  },
  {
    name: "Bilal M.",
    text: "Booked the PS5 lounge for my birthday — great setup, quick food service, and the arcade combo is a steal.",
    rating: 5,
  },
  {
    name: "Fatima S.",
    text: "Beautiful interiors, solid sheesha selection, and staff who actually care. My weekend spot now.",
    rating: 4,
  },
];

const GALLERY = [
  "photo-1554118811-1e0d58224f24",
  "photo-1559925393-8be0ec4767c8",
  "photo-1517248135467-4c7edcad34c4",
  "photo-1552566626-52f8b828add9",
];

export default function HomePage() {
  const [featured, setFeatured] = useState<MenuItemDTO[]>([]);

  useEffect(() => {
    fetch("/api/menu?available=true")
      .then((r) => r.json())
      .then((d) => {
        const items: MenuItemDTO[] = d.items ?? [];
        setFeatured(
          items
            .filter((i) => i.tags.includes("Bestseller") || i.tags.includes("Chef Special"))
            .slice(0, 4)
        );
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <Hero />

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">
              Customer favourites
            </p>
            <h2 className="section-title mt-1">Bestsellers & Chef Specials</h2>
          </div>
          <Link href="/menu" className="btn-ghost hidden sm:inline-flex">
            <ShoppingBag className="h-4 w-4" /> Full Menu
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass overflow-hidden"
            >
              {item.imageUrl && (
                <div className="relative h-40">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="font-semibold text-zinc-50">{item.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-gold-400">
                    {formatPKR(item.priceCents)}
                  </span>
                  <Link
                    href="/menu"
                    className="text-sm font-semibold text-gold-400 hover:underline"
                  >
                    Order
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Play area teaser */}
      <section className="border-y border-white/10 bg-ink-900/60">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">
              Gaming & Play Area
            </p>
            <h2 className="section-title mt-1">
              PS5 · VR · Snooker · Arcade
            </h2>
            <p className="mt-3 text-zinc-400">
              Hourly bookings, VR sessions and combo food + gaming packages —
              reserve your slot and skip the wait.
            </p>
            <Link href="/book" className="btn-gold mt-6">
              <Gamepad2 className="h-5 w-5" /> Book a Slot
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-64 overflow-hidden rounded-2xl border border-white/10 md:h-80"
          >
            <Image
              src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1000&q=80"
              alt="Gaming arena"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </motion.div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">
          Reviews
        </p>
        <h2 className="section-title mt-1">Loved by our guests</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass p-6"
            >
              <Quote className="mb-3 h-6 w-6 text-gold-500" />
              <blockquote className="text-sm text-zinc-300">{r.text}</blockquote>
              <figcaption className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-100">{r.name}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s < r.rating
                          ? "fill-gold-400 text-gold-400"
                          : "text-zinc-700"
                      }`}
                    />
                  ))}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="section-title">Inside Shery Cafe</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {GALLERY.map((id, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative h-44 overflow-hidden rounded-2xl border border-white/10 md:h-56"
            >
              <Image
                src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`}
                alt="Shery Cafe atmosphere"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="25vw"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Owner */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="glass grid items-center gap-8 overflow-hidden p-6 sm:p-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-80 overflow-hidden rounded-2xl border border-gold-500/20 sm:h-96"
          >
            <Image
              src="/owner.jpg"
              alt="Sheharyar — Owner of Shery Cafe"
              fill
              className="object-cover object-[center_25%]"
              sizes="50vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">
              Meet the owner
            </p>
            <h2 className="section-title mt-1">
              Sheharyar
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              The face behind Shery Cafe — built on a simple promise: great
              taste, unforgettable vibe, and entertainment under one roof.
              Every cup, every plate, and every game night here carries his
              personal touch.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a
                href="tel:03396030012"
                className="flex items-center gap-3 text-zinc-300 transition hover:text-gold-400"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500/15 text-gold-400">
                  <Phone className="h-4 w-4" />
                </span>
                0339 6030012
              </a>
              <p className="flex items-center gap-3 text-zinc-300">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500/15 text-gold-400">
                  <MapPin className="h-4 w-4" />
                </span>
                Defence Phase VI, Karachi
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-ink-900/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold">
              Shery <span className="gold-text">Cafe</span>
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Taste, Vibe & Entertainment. Open daily 12 PM – 2 AM.
            </p>
          </div>
          <div>
            <p className="label">Visit</p>
            <p className="text-sm text-zinc-400">
              Defence Phase VI, Karachi
              <br />
              0339 6030012
            </p>
          </div>
          <div>
            <p className="label">Quick links</p>
            <div className="flex flex-col gap-1 text-sm">
              <Link href="/menu" className="text-zinc-400 hover:text-gold-400">
                Menu
              </Link>
              <Link href="/book" className="text-zinc-400 hover:text-gold-400">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarCheck className="h-3.5 w-3.5" /> Reserve a table
                </span>
              </Link>
              <Link href="/admin/login" className="text-zinc-500 hover:text-gold-400">
                <span className="inline-flex items-center gap-1.5">
                  <Coffee className="h-3.5 w-3.5" /> Admin
                </span>
              </Link>
            </div>
          </div>
        </div>
        <p className="border-t border-white/5 py-4 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Shery Cafe. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
