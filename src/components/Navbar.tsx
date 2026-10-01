"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Menu as MenuIcon, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/book", label: "Reserve" },
  { href: "/checkout", label: "Checkout" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const itemCount = useCart((s) => s.itemCount());

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 text-ink-950 shadow-glow-sm">
            <Coffee className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-wide">
            Shery <span className="gold-text">Cafe</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                pathname === l.href
                  ? "bg-white/10 text-gold-400"
                  : "text-zinc-300 hover:bg-white/5 hover:text-zinc-50"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              document.dispatchEvent(new CustomEvent("shery:open-cart"))
            }
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 transition hover:border-gold-500/60"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-ink-950">
                {itemCount}
              </span>
            )}
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 py-3 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={clsx(
                "block rounded-lg px-3 py-2.5 text-sm font-medium",
                pathname === l.href ? "bg-white/10 text-gold-400" : "text-zinc-300"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
