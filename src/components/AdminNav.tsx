"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarCheck,
  BadgePercent,
  LogOut,
  Coffee,
} from "lucide-react";
import clsx from "clsx";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/admin/promos", label: "Promos & Banners", icon: BadgePercent },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-ink-900/70 md:h-screen md:w-60 md:border-b-0 md:border-r md:sticky md:top-0">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 text-ink-950">
          <Coffee className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display font-bold">Shery Cafe</p>
          <p className="text-xs text-zinc-500">Admin Panel</p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={clsx(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition",
              pathname === l.href
                ? "bg-gold-500/15 text-gold-400"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
            )}
          >
            <l.icon className="h-4 w-4" /> {l.label}
          </Link>
        ))}
        <button
          onClick={logout}
          className="flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </nav>
    </aside>
  );
}
