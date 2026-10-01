"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import AdminNav from "@/components/AdminNav";
import StatusPill from "@/components/StatusPill";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  guests: number;
  areaType: string;
  status: string;
  notes?: string | null;
}

export default function AdminReservationsPage() {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/reservations");
    const data = await res.json();
    setRows(data.reservations ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (id: string, status: "CONFIRMED" | "REJECTED") => {
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 p-6 md:p-10">
        <h1 className="section-title">Reservations</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Accept or reject table & play-area bookings.
        </p>

        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          </div>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-zinc-500">No reservations yet.</p>
        ) : (
          <div className="glass mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Area</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Decision</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-100">{r.name}</p>
                      <p className="text-xs text-zinc-500">
                        {r.phone} · {r.guests} guests
                        {r.notes ? ` · ${r.notes}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {new Date(r.date).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-zinc-500">{r.timeSlot}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{r.areaType}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => decide(r.id, "CONFIRMED")}
                          disabled={r.status === "CONFIRMED"}
                          className="flex items-center gap-1 rounded-lg bg-green-500/15 px-2.5 py-1.5 text-xs font-bold text-green-300 transition hover:bg-green-500 hover:text-ink-950 disabled:opacity-40"
                        >
                          <Check className="h-3.5 w-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => decide(r.id, "REJECTED")}
                          disabled={r.status === "REJECTED"}
                          className="flex items-center gap-1 rounded-lg bg-red-500/15 px-2.5 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-500 hover:text-ink-950 disabled:opacity-40"
                        >
                          <X className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
