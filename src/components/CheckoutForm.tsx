"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BadgePercent,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useCart, type OrderType } from "@/store/cart";
import { formatPKR } from "@/lib/format";
import clsx from "clsx";

const PAYMENT_METHODS = [
  { value: "STRIPE", label: "Card (Stripe)", desc: "Credit / debit card online", icon: CreditCard },
  { value: "JAZZCASH", label: "JazzCash", desc: "Mobile wallet — manual confirm", icon: Wallet },
  { value: "EASYPAISA", label: "EasyPaisa", desc: "Mobile wallet — manual confirm", icon: Wallet },
  { value: "COD", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: Wallet },
  { value: "PAY_AT_TABLE", label: "Pay at Table", desc: "For dine-in guests", icon: ShieldCheck },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

export default function CheckoutForm() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotalCents());
  const clear = useCart((s) => s.clear);
  const orderType = useCart((s) => s.orderType);
  const setOrderType = useCart((s) => s.setOrderType);

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; percentOff: number } | null>(null);
  const [promoMsg, setPromoMsg] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [details, setDetails] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    tableNumber: "",
    notes: "",
  });
  const [ageVerified, setAgeVerified] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ orderId: string; total: number } | null>(null);

  const hasRestricted = items.some((i) => i.isAgeRestricted);
  const discount = promo ? Math.floor((subtotal * promo.percentOff) / 100) : 0;
  const total = Math.max(0, subtotal - discount);

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setPromoMsg("");
    try {
      const res = await fetch(`/api/promos?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Invalid code");
      setPromo({ code: data.promo.code, percentOff: data.promo.percentOff });
      setPromoMsg(`Applied — ${data.promo.percentOff}% off`);
    } catch (e) {
      setPromo(null);
      setPromoMsg(e instanceof Error ? e.message : "Invalid code");
    }
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
            customizations: i.customizations,
          })),
          type: orderType,
          paymentMethod,
          promoCode: promo?.code ?? "",
          customerName: details.customerName,
          customerPhone: details.customerPhone,
          address: details.address,
          tableNumber: details.tableNumber,
          notes: details.notes,
          ageVerified,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      if (data.payment?.method === "STRIPE" && data.payment.clientSecret) {
        if (data.payment.mock) {
          // Mock/demo mode: simulate a successful card charge locally.
          setDone({ orderId: data.order.id, total: data.order.totalCents });
          clear();
        } else {
          setError(
            "Card payment was initialised but this demo build does not include Stripe.js Elements. Please use COD or a wallet method, or finish the Stripe Elements integration."
          );
        }
      } else {
        setDone({ orderId: data.order.id, total: data.order.totalCents });
        clear();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setPlacing(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass mx-auto max-w-lg p-10 text-center"
      >
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-400" />
        <h2 className="text-2xl font-bold">Order Placed!</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Order <span className="font-mono text-gold-400">{done.orderId.slice(0, 8)}</span>{" "}
          · Total {formatPKR(done.total)}. Our team will confirm shortly.
        </p>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass mx-auto max-w-lg p-10 text-center">
        <p className="text-zinc-400">Your cart is empty.</p>
      </div>
    );
  }

  const set = (k: keyof typeof details, v: string) =>
    setDetails((d) => ({ ...d, [k]: v }));

  return (
    <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {/* Order type */}
        <section className="glass p-6">
          <h3 className="mb-3 font-bold">Order Type</h3>
          <div className="flex gap-2">
            {(["DELIVERY", "PICKUP", "DINE_IN"] as OrderType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setOrderType(t)}
                className={clsx(
                  "flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                  orderType === t
                    ? "border-gold-500 bg-gold-500/15 text-gold-400"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-gold-500/40"
                )}
              >
                {t === "DINE_IN" ? "Dine-In" : t[0] + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </section>

        {/* Details */}
        <section className="glass space-y-4 p-6">
          <h3 className="font-bold">Your Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="co-name">Name</label>
              <input id="co-name" required value={details.customerName} onChange={(e) => set("customerName", e.target.value)} className="input-dark" placeholder="Ali Raza" />
            </div>
            <div>
              <label className="label" htmlFor="co-phone">Phone</label>
              <input id="co-phone" required value={details.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} className="input-dark" placeholder="03xx xxxxxxx" />
            </div>
            {orderType === "DELIVERY" && (
              <div className="sm:col-span-2">
                <label className="label" htmlFor="co-address">Delivery address</label>
                <textarea id="co-address" required={orderType === "DELIVERY"} rows={2} value={details.address} onChange={(e) => set("address", e.target.value)} className="input-dark" placeholder="House, street, area..." />
              </div>
            )}
            {orderType === "DINE_IN" && (
              <div>
                <label className="label" htmlFor="co-table">Table number (optional)</label>
                <input id="co-table" value={details.tableNumber} onChange={(e) => set("tableNumber", e.target.value)} className="input-dark" placeholder="T-12" />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="label" htmlFor="co-notes">Notes (optional)</label>
              <input id="co-notes" value={details.notes} onChange={(e) => set("notes", e.target.value)} className="input-dark" placeholder="Extra napkins, less ice..." />
            </div>
          </div>
          {hasRestricted && (
            <label className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              <input type="checkbox" checked={ageVerified} onChange={(e) => setAgeVerified(e.target.checked)} className="mt-1 accent-red-500" />
              I confirm I am 18+ and my cart contains sheesha lounge items.
            </label>
          )}
        </section>

        {/* Payment */}
        <section className="glass p-6">
          <h3 className="mb-3 font-bold">Payment Method</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setPaymentMethod(m.value)}
                className={clsx(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                  paymentMethod === m.value
                    ? "border-gold-500 bg-gold-500/10"
                    : "border-white/10 bg-white/5 hover:border-gold-500/40"
                )}
              >
                <m.icon className="h-5 w-5 shrink-0 text-gold-400" />
                <span>
                  <span className="block text-sm font-semibold text-zinc-100">{m.label}</span>
                  <span className="block text-xs text-zinc-500">{m.desc}</span>
                </span>
              </button>
            ))}
          </div>
          {(paymentMethod === "JAZZCASH" || paymentMethod === "EASYPAISA") && (
            <p className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
              After placing your order you will receive wallet transfer
              instructions; your order is confirmed once our team verifies the
              payment.
            </p>
          )}
        </section>
      </div>

      {/* Summary */}
      <aside className="glass h-fit space-y-4 p-6 lg:sticky lg:top-24">
        <h3 className="font-bold">Summary</h3>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.key} className="flex justify-between gap-2">
              <span className="text-zinc-400">
                {i.quantity}× {i.title}
              </span>
              <span className="font-semibold text-zinc-200">
                {formatPKR(i.unitPriceCents * i.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <BadgePercent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Promo code"
              className="input-dark pl-9 uppercase"
            />
          </div>
          <button type="button" onClick={applyPromo} className="btn-ghost px-4 py-2 text-sm">
            Apply
          </button>
        </div>
        {promoMsg && (
          <p className={clsx("text-xs", promo ? "text-green-400" : "text-red-400")}>
            {promoMsg}
          </p>
        )}

        <dl className="space-y-1.5 border-t border-white/10 pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-400">Subtotal</dt>
            <dd className="font-semibold">{formatPKR(subtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-400">
              <dt>Discount ({promo?.code})</dt>
              <dd>−{formatPKR(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-white/10 pt-2 text-base">
            <dt className="font-bold">Total</dt>
            <dd className="font-bold text-gold-400">{formatPKR(total)}</dd>
          </div>
        </dl>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={placing || (hasRestricted && !ageVerified)} className="btn-gold w-full">
          {placing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Placing...
            </>
          ) : (
            `Place Order · ${formatPKR(total)}`
          )}
        </button>
      </aside>
    </form>
  );
}
