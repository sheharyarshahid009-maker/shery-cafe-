import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderType = "DELIVERY" | "PICKUP" | "DINE_IN";

export interface CartCustomization {
  option: string;
  choice: string;
  priceDeltaCents: number;
}

export interface CartItem {
  key: string; // menuItemId + serialized customizations
  menuItemId: string;
  title: string;
  imageUrl?: string | null;
  unitPriceCents: number; // base + customization deltas
  quantity: number;
  customizations: CartCustomization[];
  isAgeRestricted: boolean;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  promoPercentOff: number | null;
  orderType: OrderType;
  addItem: (item: Omit<CartItem, "key" | "quantity">, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  setPromo: (code: string | null, percentOff?: number | null) => void;
  setOrderType: (t: OrderType) => void;
  subtotalCents: () => number;
  itemCount: () => number;
}

function makeKey(menuItemId: string, customizations: CartCustomization[]) {
  const sig = customizations
    .map((c) => `${c.option}:${c.choice}`)
    .sort()
    .join("|");
  return `${menuItemId}::${sig}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoPercentOff: null,
      orderType: "DELIVERY",

      addItem: (item, qty = 1) => {
        const key = makeKey(item.menuItemId, item.customizations);
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + qty } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, key, quantity: qty }] });
        }
      },

      removeItem: (key) =>
        set({ items: get().items.filter((i) => i.key !== key) }),

      updateQty: (key, qty) => {
        if (qty <= 0) {
          get().removeItem(key);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.key === key ? { ...i, quantity: qty } : i
          ),
        });
      },

      clear: () => set({ items: [], promoCode: null, promoPercentOff: null }),

      setPromo: (code, percentOff = null) =>
        set({ promoCode: code, promoPercentOff: percentOff }),

      setOrderType: (orderType) => set({ orderType }),

      subtotalCents: () =>
        get().items.reduce((s, i) => s + i.unitPriceCents * i.quantity, 0),

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "shery-cart" }
  )
);
