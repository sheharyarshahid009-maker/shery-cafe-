"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPKR } from "@/lib/format";

const WHATSAPP_NUMBER = "923396030012";

function buildWhatsAppOrderUrl(items: ReturnType<typeof useCart.getState>["items"], subtotalCents: number) {
  const lines = items.map((i, idx) => {
    const custom = i.customizations.length > 0
      ? ` (${i.customizations.map((c) => `${c.option}: ${c.choice}`).join(", ")})`
      : "";
    return `${idx + 1}. ${i.title}${custom} x${i.quantity} - ${formatPKR(i.unitPriceCents * i.quantity)}`;
  });
  const message = `*New Order - Shery Cafe*\n-------------------------\n${lines.join("\n")}\n-------------------------\n*Total: ${formatPKR(subtotalCents)}*`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);
  const subtotalCents = useCart((s) => s.subtotalCents());
  const itemCount = useCart((s) => s.itemCount());

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("shery:open-cart", handler);
    return () => document.removeEventListener("shery:open-cart", handler);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-900"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <ShoppingBag className="h-5 w-5 text-gold-400" />
                Your Order
                {itemCount > 0 && (
                  <span className="rounded-full bg-gold-500/20 px-2.5 py-0.5 text-xs font-bold text-gold-400">
                    {itemCount}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-zinc-700" />
                    <p className="text-zinc-400">Your cart is empty.</p>
                    <Link
                      href="/menu"
                      onClick={() => setOpen(false)}
                      className="btn-ghost mt-4"
                    >
                      Browse Menu
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((i) => (
                    <li key={i.key} className="glass p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-zinc-50">
                            {i.title}
                          </p>
                          {i.customizations.length > 0 && (
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {i.customizations
                                .map((c) => `${c.option}: ${c.choice}`)
                                .join(" · ")}
                            </p>
                          )}
                          <p className="mt-1 text-sm font-bold text-gold-400">
                            {formatPKR(i.unitPriceCents)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(i.key)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQty(i.key, i.quantity - 1)}
                          className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 hover:border-gold-500/50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">
                          {i.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(i.key, i.quantity + 1)}
                          className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 hover:border-gold-500/50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Subtotal</span>
                  <span className="text-xl font-bold text-gold-400">
                    {formatPKR(subtotalCents)}
                  </span>
                </div>
                <a
                  href={buildWhatsAppOrderUrl(items, subtotalCents)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1fb857]"
                >
                  <MessageCircle className="h-4 w-4" /> Order via WhatsApp
                </a>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="btn-ghost mt-2 w-full"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
