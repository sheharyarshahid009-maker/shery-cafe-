"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Star, Upload, X } from "lucide-react";
import Image from "next/image";

const PHOTOS = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    name: "Ahmed R.",
    caption: "Best BBQ platter in DHA! 🔥",
    rating: 5,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80",
    name: "Sara M.",
    caption: "Sheesha + sunset = perfect evening ✨",
    rating: 5,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    name: "Usman K.",
    caption: "Celebrated my birthday here — amazing staff!",
    rating: 5,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
    name: "Fatima A.",
    caption: "Cozy vibes, great coffee ☕",
    rating: 4,
  },
];

export default function GalleryPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ name: "", caption: "", rating: 5 });

  const submitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `*Photo Review - Shery Cafe*\nName: ${form.name}\nRating: ${form.rating}/5\nCaption: ${form.caption}\n\n(Photo attach karke bhejein!)`;
    window.open(
      `https://wa.me/923396030012?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
    setShowUpload(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">
        Community
      </p>
      <h1 className="section-title mt-1 text-center">Customer Photos 📸</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        Real moments from real guests — food, sheesha, gaming and good times at
        Shery Cafe!
      </p>

      <div className="mt-6 text-center">
        <button onClick={() => setShowUpload(true)} className="btn-gold">
          <Camera className="h-4 w-4" /> Share Your Photo
        </button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {PHOTOS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="glass group overflow-hidden"
          >
            <div className="relative h-48 md:h-56">
              <Image
                src={p.src}
                alt={p.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="25vw"
              />
            </div>
            <div className="p-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-3 w-3 ${s < p.rating ? "fill-gold-400 text-gold-400" : "text-zinc-700"}`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-sm text-zinc-300">{p.caption}</p>
              <p className="mt-1 text-xs font-semibold text-gold-400">— {p.name}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-50">Share Your Moment</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submitPhoto} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Your Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ali Khan"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold-500/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}>
                      <Star className={`h-7 w-7 ${n <= form.rating ? "fill-gold-400 text-gold-400" : "text-zinc-700"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Caption
                </label>
                <input
                  required
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Amazing food! 🔥"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold-500/50"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white hover:bg-[#1fb857]"
              >
                <Upload className="h-4 w-4" /> Send via WhatsApp
              </button>
              <p className="text-center text-xs text-zinc-500">
                WhatsApp pe photo attach karke bhej dein — hum gallery me laga denge!
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
