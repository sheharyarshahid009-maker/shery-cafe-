"use client";

import { useCart, type CartCustomization } from "@/store/cart";
import MenuTabs, { useMenuData } from "@/components/MenuTabs";
import type { MenuItemDTO } from "@/components/MenuCard";
import { Loader2 } from "lucide-react";

export default function MenuPage() {
  const { items, categories, loading } = useMenuData();
  const addItem = useCart((s) => s.addItem);

  const handleAdd = (item: MenuItemDTO, customizations: CartCustomization[]) => {
    const delta = customizations.reduce((s, c) => s + c.priceDeltaCents, 0);
    addItem(
      {
        menuItemId: item.id,
        title: item.title,
        imageUrl: item.imageUrl ?? null,
        unitPriceCents: item.priceCents + delta,
        customizations,
        isAgeRestricted: item.isAgeRestricted,
      },
      1
    );
    document.dispatchEvent(new CustomEvent("shery:open-cart"));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">
        Our Menu
      </p>
      <h1 className="section-title mt-1">Eat, Sip & Play</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        Sheesha lounge items are strictly 18+. Play-area items are bookable
        hourly — reserve your slot after adding to cart or via the Reserve page.
      </p>

      <div className="mt-8">
        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          </div>
        ) : (
          <MenuTabs items={items} categories={categories} onAdd={handleAdd} />
        )}
      </div>
    </div>
  );
}
