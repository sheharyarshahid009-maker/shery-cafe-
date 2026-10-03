"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Coffee, Gamepad2, MapPin, Phone, Quote, ShoppingBag, Star,
  CalendarCheck, Facebook, Instagram, Twitter, Award, Clock,
  PartyPopper, Camera, QrCode, Gift, PackageSearch, RotateCw,
} from "lucide-react";
import Hero from "@/components/Hero";
import { useEffect, useState } from "react";
import type { MenuItemDTO } from "@/components/MenuCard";
import { formatPKR } from "@/lib/format";

const REVIEWS = [
  { name: "Ayesha K.", text: "The Spanish latte is genuinely the best I have had in Karachi. The lounge vibe at night is unmatched.", rating: 5 },
  { name: "Bilal M.", text: "Booked the PS5 lounge for my birthday — great setup, quick food service, and the arcade combo is a steal.", rating: 5 },
  { name: "Fatima S.", text: "Beautiful interiors, solid sheesha selection, and staff who actually care. My weekend spot now.", rating: 4 },
];
const GALLERY = ["/cafe1.jpg", "/cafe2.jpg", "/cafe3.jpg", "/cafe4.jpg"];
const GAMING = [
  { label: "PS5", desc: "Latest titles on 4K setup", id: "photo-1606813907291-d86efa9b94db" },
  { label: "VR", desc: "Immersive virtual reality", id: "photo-1622979135225-d2ba269cf1ac" },
  { label: "Snooker", desc: "Pro tables, hourly rates", id: "/snooker.jpg" },
  { label: "Arcade", desc: "Classic arcade machines", id: "photo-1511882150382-421056c89033" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<MenuItemDTO[]>([]);
  useEffect(() => {
    fetch("/api/menu?available=true").then((r) => r.json()).then((d) => {
      const items: MenuItemDTO[] = d.items ?? [];
      setFeatured(items.filter((i) => i.tags.includes("Bestseller") || i.tags.includes("Chef Special")).slice(0, 4));
    }).catch(() => {});
  }, []);
  return (
    <div>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">Customer favourites</p>
            <h2 className="section-title mt-1">Bestsellers & Chef Specials</h2>
          </div>
          <Link href="/menu" className="btn-ghost hidden sm:inline-flex"><ShoppingBag className="h-4 w-4" /> Full Menu</Link>
        </div>
        <div className="auto-grid">
          {featured.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="glass overflow-hidden">
              {item.imageUrl && (<div className="relative h-40"><Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="25vw" /></div>)}
              <div className="p-4">
                <p className="font-semibold text-zinc-50">{item.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-gold-400">{formatPKR(item.priceCents)}</span>
                  <Link href="/menu" className="text-sm font-semibold text-gold-400 hover:underline">Order</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="border-y border-white/10 bg-ink-900/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">Gaming & Play Area</p>
            <h2 className="section-title mt-1">PS5 · VR · Snooker · Arcade</h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-400">Hourly bookings, VR sessions and combo food + gaming packages — reserve your slot and skip the wait.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/book" className="btn-gold"><Gamepad2 className="h-5 w-5" /> Book a Slot</Link>
              <Link href="/party" className="btn-ghost"><PartyPopper className="h-5 w-5" /> Book Your Party</Link>
            </div>
          </motion.div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {GAMING.map((g, i) => (
              <motion.div key={g.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="group relative h-52 overflow-hidden rounded-2xl border border-white/10 md:h-64">
                <Image src={g.id.startsWith("/") ? g.id : `https://images.unsplash.com/${g.id}?auto=format&fit=crop&w=600&q=80`} alt={g.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-lg font-bold text-white">{g.label}</p><p className="text-sm text-zinc-300">{g.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-r from-gold-500/15 via-gold-500/5 to-transparent p-8 sm:p-12">
          <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-500"><PartyPopper className="h-4 w-4" /> Events & Celebrations</p>
              <h2 className="section-title mt-2">We Host Parties Too! 🎉</h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-400">Birthdays, anniversaries, corporate events, farewells — celebrate with food, sheesha, PS5, VR and music, all under one roof!</p>
            </div>
            <Link href="/party" className="btn-gold shrink-0"><PartyPopper className="h-5 w-5" /> Book Your Party</Link>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 p-8 sm:p-10">
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-500"><CalendarCheck className="h-4 w-4" /> What's On</p>
              <h2 className="section-title mt-2">Upcoming Events 📅</h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-400">Live music nights, karaoke, PS5 tournaments and Sufi nights — there's always something happening at Shery Cafe!</p>
            </div>
            <Link href="/events" className="btn-gold shrink-0"><CalendarCheck className="h-5 w-5" /> View All Events</Link>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 p-8 sm:p-10">
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-500"><Camera className="h-4 w-4" /> Community</p>
              <h2 className="section-title mt-2">Customer Photos 📸</h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-400">Real moments from real guests — share your food photos and get featured on our wall of fame!</p>
            </div>
            <Link href="/gallery" className="btn-gold shrink-0"><Camera className="h-5 w-5" /> View Gallery</Link>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-r from-gold-500/15 via-gold-500/5 to-transparent p-8 sm:p-10">
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-500"><Gift className="h-4 w-4" /> Give The Gift Of Taste</p>
              <h2 className="section-title mt-2">Gift Cards 🎁</h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-400">Perfect for birthdays and celebrations — give your loved ones the Shery Cafe experience!</p>
            </div>
            <Link href="/gift-cards" className="btn-gold shrink-0"><Gift className="h-5 w-5" /> Buy Gift Card</Link>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 p-8 sm:p-10">
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-500"><PackageSearch className="h-4 w-4" /> Live Updates</p>
              <h2 className="section-title mt-2">Track Your Order 📦</h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-400">Apna order live track karein — kab ban raha hai, kab ready hoga, sab pata chalega!</p>
            </div>
            <Link href="/track" className="btn-gold shrink-0"><PackageSearch className="h-5 w-5" /> Track Order</Link>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-r from-gold-500/15 via-gold-500/5 to-transparent p-8 sm:p-10">
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-500"><Star className="h-4 w-4" /> Rewards Program</p>
              <h2 className="section-title mt-2">Shery Rewards ⭐</h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-400">Jitna khao, utne points! Free food, discounts aur VIP perks pao!</p>
            </div>
            <Link href="/loyalty" className="btn-gold shrink-0"><Star className="h-5 w-5" /> Join Free</Link>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-r from-gold-500/15 via-gold-500/5 to-transparent p-8 sm:p-10">
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-500"><RotateCw className="h-4 w-4" /> Daily Fun</p>
              <h2 className="section-title mt-2">Spin & Win 🎡</h2>
              <p className="mt-3 max-w-xl text-sm text-zinc-400">Roz ek free spin! Discounts aur free items jeeto!</p>
            </div>
            <Link href="/spin" className="btn-gold shrink-0"><RotateCw className="h-5 w-5" /> Spin Now</Link>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">Reviews</p>
        <h2 className="section-title mt-1">Loved by our guests</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.figure key={r.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="glass p-6">
              <Quote className="mb-3 h-6 w-6 text-gold-500" />
              <blockquote className="text-sm text-zinc-300">{r.text}</blockquote>
              <figcaption className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-100">{r.name}</span>
                <span className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => (<Star key={s} className={`h-3.5 w-3.5 ${s < r.rating ? "fill-gold-400 text-gold-400" : "text-zinc-700"}`} />))}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="section-title">Inside Shery Cafe</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {GALLERY.map((id, i) => (
            <motion.div key={id} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="relative h-44 overflow-hidden rounded-2xl border border-white/10 md:h-56">
              <Image src={id.startsWith("/") ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`} alt="Shery Cafe atmosphere" fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="25vw" />
            </motion.div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="glass relative overflow-hidden p-6 sm:p-10">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-5">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative h-80 overflow-hidden rounded-2xl border border-gold-500/30 sm:h-96 md:col-span-2">
              <Image src="/owner.jpg" alt="Muhammad Shehryar Khan — Founder of Shery Cafe" fill className="object-cover object-[center_25%]" sizes="40vw" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4"><p className="text-lg font-bold text-white">Muhammad Shehryar Khan</p><p className="text-sm text-gold-400">Founder & CEO</p></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="md:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">Meet the owner</p>
              <h2 className="section-title mt-1">Muhammad Shehryar Khan</h2>
              <p className="mt-2 text-sm font-medium text-gold-400">Founder & CEO — Shery Cafe</p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">The visionary behind Shery Cafe — built on a simple promise: great taste, unforgettable vibe, and entertainment under one roof. From handpicked coffee beans to the perfect sheesha blend, every detail here carries his personal touch and passion for hospitality.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-400"><Award className="h-4 w-4" /></span><div className="min-w-0"><p className="truncate font-semibold text-zinc-100">Premium Quality</p><p className="truncate text-xs text-zinc-500">Best ingredients</p></div></div>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-400"><Clock className="h-4 w-4" /></span><div><p className="font-semibold text-zinc-100">Open Daily</p><p className="text-xs text-zinc-500">12 PM – 2 AM</p></div></div>
                <a href="tel:03396030012" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-gold-500/40"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-400"><Phone className="h-4 w-4" /></span><div><p className="font-semibold text-zinc-100">0339 6030012</p><p className="text-xs text-zinc-500">Call us</p></div></a>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-400"><MapPin className="h-4 w-4" /></span><div><p className="font-semibold text-zinc-100">Defence Phase VI</p><p className="text-xs text-zinc-500">Karachi</p></div></div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Follow</span>
                <a href="https://facebook.com/muhammadshehryarkhan" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:border-gold-500/50 hover:text-gold-400"><Facebook className="h-4 w-4" /></a>
                <a href="https://instagram.com/sherrry_10" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:border-gold-500/50 hover:text-gold-400"><Instagram className="h-4 w-4" /></a>
                <a href="https://twitter.com/sherrry_10" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:border-gold-500/50 hover:text-gold-400"><Twitter className="h-4 w-4" /></a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <footer className="border-t border-white/10 bg-ink-900/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold">Shery <span className="gold-text">Cafe</span></p>
            <p className="mt-2 text-sm text-zinc-400">Taste, Vibe & Entertainment. Open daily 12 PM – 2 AM.</p>
          </div>
          <div><p className="label">Visit</p><p className="text-sm text-zinc-400">Defence Phase VI, Karachi<br />0339 6030012</p></div>
          <div>
            <p className="label">Quick links</p>
            <div className="flex flex-col gap-1 text-sm">
              <Link href="/menu" className="text-zinc-400 hover:text-gold-400">Menu</Link>
              <Link href="/book" className="text-zinc-400 hover:text-gold-400"><span className="inline-flex items-center gap-1.5"><CalendarCheck className="h-3.5 w-3.5" /> Reserve a table</span></Link>
              <Link href="/party" className="text-zinc-400 hover:text-gold-400"><span className="inline-flex items-center gap-1.5"><PartyPopper className="h-3.5 w-3.5" /> Book a party</span></Link>
              <Link href="/events" className="text-zinc-400 hover:text-gold-400"><span className="inline-flex items-center gap-1.5"><CalendarCheck className="h-3.5 w-3.5" /> Upcoming events</span></Link>
              <Link href="/gallery" className="text-zinc-400 hover:text-gold-400"><span className="inline-flex items-center gap-1.5"><Camera className="h-3.5 w-3.5" /> Customer photos</span></Link>
              <Link href="/gift-cards" className="text-zinc-400 hover:text-gold-400"><span className="inline-flex items-center gap-1.5"><Gift className="h-3.5 w-3.5" /> Gift cards</span></Link>
              <Link href="/track" className="text-zinc-400 hover:text-gold-400"><span className="inline-flex items-center gap-1.5"><PackageSearch className="h-3.5 w-3.5" /> Track order</span></Link>
              <Link href="/loyalty" className="text-zinc-400 hover:text-gold-400"><span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5" /> Shery Rewards</span></Link>
              <Link href="/spin" className="text-zinc-400 hover:text-gold-400"><span className="inline-flex items-center gap-1.5"><RotateCw className="h-3.5 w-3.5" /> Spin & Win</span></Link>
              <Link href="/tables" className="text-zinc-500 hover:text-gold-400"><span className="inline-flex items-center gap-1.5"><QrCode className="h-3.5 w-3.5" /> Table QR codes</span></Link>
              <Link href="/admin/login" className="text-zinc-500 hover:text-gold-400"><span className="inline-flex items-center gap-1.5"><Coffee className="h-3.5 w-3.5" /> Admin</span></Link>
            </div>
          </div>
        </div>
        <p className="border-t border-white/5 py-4 text-center text-xs text-zinc-600">© {new Date().getFullYear()} Shery Cafe. All rights reserved.</p>
      </footer>
    </div>
  );
}
