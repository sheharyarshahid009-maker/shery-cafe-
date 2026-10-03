"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarCheck,
  BadgePercent,
  BarChart3,
  LogOut,
  Coffee,
} from "lucide-react";
import clsx from "clsx";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
  { href: "/admin/promos", label: "Promos & Banners", icon: BadgePercent },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = () => {
    document.cookie = "admin_auth=; Max-Age=0; path=/";
    router.push("/admin/login");
  };
  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-ink-900 md:min-h-screen md:w-56 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-4 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500"><Coffee className="h-4 w-4 text-ink-950" /></span>
        <p className="font-display text-lg font-bold">Shery <span className="gold-text">Admin</span></p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                pathname === l.href
                  ? "bg-gold-500/15 text-gold-400"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <Icon className="h-4 w-4" /> {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-5 pt-2">
        <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
