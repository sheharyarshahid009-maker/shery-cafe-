"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, Plus, Star } from "lucide-react";
import { formatPKR } from "@/lib/format";

export interface MenuItemDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  priceCents: number;
  imageUrl?: string | null;
  tags: string[];
  spiceLevel?: number | null;
  isAgeRestricted: boolean;
  category: { name: string; slug: string };
  customizationOptions?: unknown;
}

export default function MenuCard({
  item,
  onAdd,
  index = 0,
}: {
  item: MenuItemDTO;
  onAdd: (item: MenuItemDTO) => void;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
      className="glass group overflow-hidden transition-shadow hover:shadow-card"
    >
      <div className="relative h-44 w-full overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-ink-800 text-zinc-600">
            No image
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded-full bg-ink-950/80 px-2.5 py-1 text-[11px] font-semibold text-gold-400 backdrop-blur"
            >
              <Star className="h-3 w-3" /> {t}
            </span>
          ))}
          {item.isAgeRestricted && (
            <span className="rounded-full bg-red-950/90 px-2.5 py-1 text-[11px] font-bold text-red-300 backdrop-blur">
              18+
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-50">{item.title}</h3>
          {item.spiceLevel ? (
            <span
              className="flex shrink-0 items-center gap-0.5 pt-0.5"
              title={`Spice level ${item.spiceLevel}/3`}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <Flame
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < (item.spiceLevel ?? 0)
                      ? "fill-red-500 text-red-500"
                      : "text-zinc-700"
                  }`}
                />
              ))}
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gold-400">
            {formatPKR(item.priceCents)}
          </span>
          <button
            onClick={() => onAdd(item)}
            className="flex items-center gap-1.5 rounded-lg bg-gold-500/15 px-3.5 py-2 text-sm font-semibold text-gold-400 transition hover:bg-gold-500 hover:text-ink-950"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
