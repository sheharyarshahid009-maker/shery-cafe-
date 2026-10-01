"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import AdminNav from "@/components/AdminNav";
import { formatPKR } from "@/lib/format";
import clsx from "clsx";

interface Promo {
  id: string;
  code: string;
  percentOff: number;
  maxDiscountCents?: number | null;
  minOrderCents?: number | null;
  active: boolean;
  expiresAt?: string | null;
}
interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  ctaText?: string | null;
  ctaHref?: string | null;
  active: boolean;
  sortOrder: number;
}

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPromo, setShowPromo] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [pForm, setPForm] = useState({
    code: "",
    percentOff: "10",
    maxDiscountCents: "",
    minOrderCents: "",
    expiresAt: "",
  });
  const [bForm, setBForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    ctaText: "",
    ctaHref: "",
    sortOrder: "0",
  });

  const load = async () => {
    const res = await fetch("/api/promos");
    const data = await res.json();
    setPromos(data.promos ?? []);
    setBanners(data.banners ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const createPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "promo",
        code: pForm.code.trim().toUpperCase(),
        percentOff: Number(pForm.percentOff),
        maxDiscountCents: pForm.maxDiscountCents ? Number(pForm.maxDiscountCents) * 100 : null,
        minOrderCents: pForm.minOrderCents ? Number(pForm.minOrderCents) * 100 : null,
        expiresAt: pForm.expiresAt ? new Date(pForm.expiresAt).toISOString() : null,
      }),
    });
    setShowPromo(false);
    setPForm({ code: "", percentOff: "10", maxDiscountCents: "", minOrderCents: "", expiresAt: "" });
    await load();
  };

  const createBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "banner",
        title: bForm.title,
        subtitle: bForm.subtitle,
        imageUrl: bForm.imageUrl,
        ctaText: bForm.ctaText,
        ctaHref: bForm.ctaHref,
        sortOrder: Number(bForm.sortOrder),
      }),
    });
    setShowBanner(false);
    setBForm({ title: "", subtitle: "", imageUrl: "", ctaText: "", ctaHref: "", sortOrder: "0" });
    await load();
  };

  const toggle = async (kind: "promo" | "banner", id: string, active: boolean) => {
    await fetch(`/api/promos?kind=${kind}&id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    await load();
  };

  const remove = async (kind: "promo" | "banner", id: string) => {
    if (!confirm("Delete this?")) return;
    await fetch(`/api/promos?kind=${kind}&id=${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 space-y-10 p-6 md:p-10">
        <section>
          <div className="flex items-center justify-between">
            <h1 className="section-title">Promo Codes</h1>
            <button onClick={() => setShowPromo(true)} className="btn-gold">
              <Plus className="h-4 w-4" /> New Promo
            </button>
          </div>
          {loading ? (
            <Loader2 className="mx-auto my-10 h-8 w-8 animate-spin text-gold-500" />
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {promos.map((p) => (
                <div key={p.id} className="glass p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-lg font-bold text-gold-400">{p.code}</p>
                      <p className="text-sm text-zinc-400">
                        {p.percentOff}% off
                        {p.minOrderCents ? ` · min ${formatPKR(p.minOrderCents)}` : ""}
                        {p.maxDiscountCents ? ` · max ${formatPKR(p.maxDiscountCents)}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => remove("promo", p.id)}
                      className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                      aria-label="Delete promo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggle("promo", p.id, p.active)}
                    className={clsx(
                      "mt-3 rounded-full px-3 py-1 text-xs font-bold",
                      p.active ? "bg-green-500/15 text-green-300" : "bg-white/10 text-zinc-500"
                    )}
                  >
                    {p.active ? "Active" : "Disabled"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="section-title">Homepage Banners</h2>
            <button onClick={() => setShowBanner(true)} className="btn-gold">
              <Plus className="h-4 w-4" /> New Banner
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {banners.map((b) => (
              <div key={b.id} className="glass p-5">
                <p className="font-bold text-zinc-50">{b.title}</p>
                {b.subtitle && <p className="text-sm text-zinc-400">{b.subtitle}</p>}
                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => toggle("banner", b.id, b.active)}
                    className={clsx(
                      "rounded-full px-3 py-1 text-xs font-bold",
                      b.active ? "bg-green-500/15 text-green-300" : "bg-white/10 text-zinc-500"
                    )}
                  >
                    {b.active ? "Visible" : "Hidden"}
                  </button>
                  <button
                    onClick={() => remove("banner", b.id)}
                    className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Delete banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {showPromo && (
          <Modal onClose={() => setShowPromo(false)} title="New Promo Code">
            <form onSubmit={createPromo} className="space-y-4">
              <div>
                <label className="label">Code (A–Z, 0–9)</label>
                <input required pattern="[A-Z0-9]+" value={pForm.code} onChange={(e) => setPForm({ ...pForm, code: e.target.value.toUpperCase() })} className="input-dark uppercase" placeholder="FESTIVE15" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Percent off</label>
                  <input required type="number" min={1} max={100} value={pForm.percentOff} onChange={(e) => setPForm({ ...pForm, percentOff: e.target.value })} className="input-dark" />
                </div>
                <div>
                  <label className="label">Min order Rs (optional)</label>
                  <input type="number" min={0} value={pForm.minOrderCents} onChange={(e) => setPForm({ ...pForm, minOrderCents: e.target.value })} className="input-dark" />
                </div>
                <div>
                  <label className="label">Max discount Rs (optional)</label>
                  <input type="number" min={0} value={pForm.maxDiscountCents} onChange={(e) => setPForm({ ...pForm, maxDiscountCents: e.target.value })} className="input-dark" />
                </div>
                <div>
                  <label className="label">Expires (optional)</label>
                  <input type="date" value={pForm.expiresAt} onChange={(e) => setPForm({ ...pForm, expiresAt: e.target.value })} className="input-dark" />
                </div>
              </div>
              <button type="submit" className="btn-gold w-full">Create Promo</button>
            </form>
          </Modal>
        )}

        {showBanner && (
          <Modal onClose={() => setShowBanner(false)} title="New Banner">
            <form onSubmit={createBanner} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input required value={bForm.title} onChange={(e) => setBForm({ ...bForm, title: e.target.value })} className="input-dark" />
              </div>
              <div>
                <label className="label">Subtitle</label>
                <input value={bForm.subtitle} onChange={(e) => setBForm({ ...bForm, subtitle: e.target.value })} className="input-dark" />
              </div>
              <div>
                <label className="label">Image URL</label>
                <input value={bForm.imageUrl} onChange={(e) => setBForm({ ...bForm, imageUrl: e.target.value })} className="input-dark" placeholder="https://…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">CTA text</label>
                  <input value={bForm.ctaText} onChange={(e) => setBForm({ ...bForm, ctaText: e.target.value })} className="input-dark" />
                </div>
                <div>
                  <label className="label">CTA link</label>
                  <input value={bForm.ctaHref} onChange={(e) => setBForm({ ...bForm, ctaHref: e.target.value })} className="input-dark" placeholder="/menu" />
                </div>
              </div>
              <button type="submit" className="btn-gold w-full">Create Banner</button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}

function Modal({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-md p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
