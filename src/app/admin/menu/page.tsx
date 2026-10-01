"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import AdminNav from "@/components/AdminNav";
import { formatPKR } from "@/lib/format";
import clsx from "clsx";

interface Category {
  id: string;
  name: string;
  slug: string;
}
interface Item {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  imageUrl?: string | null;
  categoryId: string;
  category: { name: string; slug: string };
  tags: string[];
  spiceLevel?: number | null;
  isAvailable: boolean;
  isAgeRestricted: boolean;
}

const EMPTY = {
  title: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
  tags: "",
  spiceLevel: "",
  isAvailable: true,
  isAgeRestricted: false,
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch("/api/menu"),
        fetch("/api/admin/categories"),
      ]);
      const menu = await menuRes.json();
      setItems(menu.items ?? []);
      if (catRes.ok) {
        const cats = await catRes.json();
        setCategories(cats.categories ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
    setError("");
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY, categoryId: categories[0]?.id ?? "" });
    setShowForm(true);
    setError("");
  };

  const openEdit = (item: Item) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      price: (item.priceCents / 100).toFixed(2),
      imageUrl: item.imageUrl ?? "",
      categoryId: item.categoryId,
      tags: item.tags.join(", "),
      spiceLevel: item.spiceLevel?.toString() ?? "",
      isAvailable: item.isAvailable,
      isAgeRestricted: item.isAgeRestricted,
    });
    setShowForm(true);
    setError("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      description: form.description,
      priceCents: Math.round(Number(form.price) * 100),
      imageUrl: form.imageUrl,
      categoryId: form.categoryId,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      spiceLevel: form.spiceLevel === "" ? null : Number(form.spiceLevel),
      isAvailable: form.isAvailable,
      isAgeRestricted: form.isAgeRestricted,
    };
    try {
      const res = await fetch(
        editing ? `/api/menu/${editing.id}` : "/api/menu",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      closeForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    await load();
  };

  const toggleAvailable = async (item: Item) => {
    await fetch(`/api/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });
    await load();
  };

  const set = (k: keyof typeof EMPTY, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <h1 className="section-title">Menu Management</h1>
          <button onClick={openNew} className="btn-gold">
            <Plus className="h-4 w-4" /> New Item
          </button>
        </div>

        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          </div>
        ) : (
          <div className="glass mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-100">{i.title}</p>
                      <p className="text-xs text-zinc-500">
                        {i.tags.join(" · ")}
                        {i.isAgeRestricted ? " · 18+" : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{i.category.name}</td>
                    <td className="px-4 py-3 font-semibold text-gold-400">
                      {formatPKR(i.priceCents)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvailable(i)}
                        className={clsx(
                          "rounded-full px-2.5 py-1 text-[11px] font-bold",
                          i.isAvailable
                            ? "bg-green-500/15 text-green-300"
                            : "bg-red-500/15 text-red-300"
                        )}
                      >
                        {i.isAvailable ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(i)}
                          className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-gold-400"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(i.id)}
                          className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <div
            className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
            onClick={closeForm}
          >
            <form
              onSubmit={save}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong my-8 w-full max-w-lg space-y-4 p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  {editing ? "Edit Item" : "New Menu Item"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label">Title</label>
                  <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="input-dark" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description</label>
                  <textarea required rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} className="input-dark" />
                </div>
                <div>
                  <label className="label">Price (Rs)</label>
                  <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} className="input-dark" />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select required value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="input-dark">
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Image URL</label>
                  <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className="input-dark" placeholder="https://…" />
                </div>
                <div>
                  <label className="label">Tags (comma separated)</label>
                  <input value={form.tags} onChange={(e) => set("tags", e.target.value)} className="input-dark" placeholder="Bestseller, Chef Special" />
                </div>
                <div>
                  <label className="label">Spice level (0–3, blank = n/a)</label>
                  <input type="number" min={0} max={3} value={form.spiceLevel} onChange={(e) => set("spiceLevel", e.target.value)} className="input-dark" />
                </div>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => set("isAvailable", e.target.checked)} className="accent-amber-500" />
                  Available (in stock)
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input type="checkbox" checked={form.isAgeRestricted} onChange={(e) => set("isAgeRestricted", e.target.checked)} className="accent-red-500" />
                  Age restricted (18+)
                </label>
              </div>

              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button type="submit" disabled={saving} className="btn-gold w-full">
                {saving ? "Saving..." : editing ? "Save Changes" : "Create Item"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
