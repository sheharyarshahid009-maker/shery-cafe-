"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Coffee, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form
        onSubmit={submit}
        className="glass-strong w-full max-w-sm space-y-5 p-8"
      >
        <div className="text-center">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 text-ink-950 shadow-glow-sm">
            <Coffee className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-bold">Shery Cafe Admin</h1>
          <p className="text-sm text-zinc-500">Sign in to manage your cafe</p>
        </div>

        <div>
          <label className="label" htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-dark"
            placeholder="admin@sherycafe.com"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="label" htmlFor="admin-pass">Password</label>
          <input
            id="admin-pass"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-dark"
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-gold w-full">
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
