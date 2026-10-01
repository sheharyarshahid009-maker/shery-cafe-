"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import MenuCard, { MenuItemDTO } from "./MenuCard";
import clsx from "clsx";
import type { CartCustomization } from "@/store/cart";

export interface CustomizationOption {
  name: string;
  type: "single" | "multi";
  choices: { label: string; priceDeltaCents: number }[];
}

export default function MenuTabs({
  items,
  categories,
  onAdd,
}: {
  items: MenuItemDTO[];
  categories: { name: string; slug: string }[];
  onAdd: (item: MenuItemDTO, customizations: CartCustomization[]) => void;
}) {
  const [tab, setTab] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [customizing, setCustomizing] = useState<MenuItemDTO | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const inTab = tab === "all" || i.category.slug === tab;
      const inQuery =
        !q ||
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q));
      return inTab && inQuery;
    });
  }, [items, tab, query]);

  const handleAdd = (item: MenuItemDTO) => {
    const opts = (item.customizationOptions as CustomizationOption[] | null) ?? null;
    if (opts && opts.length > 0) {
      setCustomizing(item);
    } else {
      onAdd(item, []);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <TabButton active={tab === "all"} onClick={() => setTab("all")}>
            All
          </TabButton>
          {categories.map((c) => (
            <TabButton
              key={c.slug}
              active={tab === c.slug}
              onClick={() => setTab(c.slug)}
            >
              {c.name}
            </TabButton>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes..."
            className="input-dark pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">
          No items found. Try another search or category.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, i) => (
            <MenuCard key={item.id} item={item} onAdd={handleAdd} index={i} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {customizing && (
          <CustomizeModal
            item={customizing}
            onClose={() => setCustomizing(null)}
            onConfirm={(c) => {
              onAdd(customizing, c);
              setCustomizing(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
        active
          ? "bg-gold-500 text-ink-950 shadow-glow-sm"
          : "border border-white/10 bg-white/5 text-zinc-300 hover:border-gold-500/50 hover:text-gold-400"
      )}
    >
      {children}
    </button>
  );
}

function CustomizeModal({
  item,
  onClose,
  onConfirm,
}: {
  item: MenuItemDTO;
  onClose: () => void;
  onConfirm: (c: CartCustomization[]) => void;
}) {
  const opts = (item.customizationOptions as CustomizationOption[]) ?? [];
  const [picked, setPicked] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    for (const o of opts) {
      if (o.type === "single" && o.choices[0]) init[o.name] = [o.choices[0].label];
    }
    return init;
  });

  const toggle = (optName: string, choice: string, type: "single" | "multi") => {
    setPicked((prev) => {
      if (type === "single") return { ...prev, [optName]: [choice] };
      const cur = prev[optName] ?? [];
      return {
        ...prev,
        [optName]: cur.includes(choice)
          ? cur.filter((c) => c !== choice)
          : [...cur, choice],
      };
    });
  };

  const confirm = () => {
    const out: CartCustomization[] = [];
    for (const o of opts) {
      for (const label of picked[o.name] ?? []) {
        const ch = o.choices.find((c) => c.label === label);
        out.push({
          option: o.name,
          choice: label,
          priceDeltaCents: ch?.priceDeltaCents ?? 0,
        });
      }
    }
    onConfirm(out);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-md p-6"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-50">Customize</h3>
            <p className="text-sm text-zinc-400">{item.title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {opts.map((o) => (
          <div key={o.name} className="mb-4">
            <p className="label">{o.name}</p>
            <div className="flex flex-wrap gap-2">
              {o.choices.map((c) => {
                const active = (picked[o.name] ?? []).includes(c.label);
                return (
                  <button
                    key={c.label}
                    onClick={() => toggle(o.name, c.label, o.type)}
                    className={clsx(
                      "rounded-lg border px-3 py-2 text-sm transition",
                      active
                        ? "border-gold-500 bg-gold-500/15 text-gold-400"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:border-gold-500/40"
                    )}
                  >
                    {c.label}
                    {c.priceDeltaCents > 0 && (
                      <span className="ml-1 text-xs opacity-70">
                        +Rs {(c.priceDeltaCents / 100).toFixed(0)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button onClick={confirm} className="btn-gold w-full">
          Add to Cart
        </button>
      </motion.div>
    </motion.div>
  );
}

export function useMenuData() {
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items ?? []);
        const cats = new Map<string, string>();
        for (const i of d.items ?? []) cats.set(i.category.slug, i.category.name);
        setCategories(
          [...cats.entries()].map(([slug, name]) => ({ slug, name }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return { items, categories, loading };
}
