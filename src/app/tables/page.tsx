"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Printer, Plus, Minus } from "lucide-react";

const SITE_URL = "https://shery-cafe.vercel.app";

export default function TablesPage() {
  const [tableCount, setTableCount] = useState(10);

  const qrUrl = (table: number) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      `${SITE_URL}/menu?table=${table}`
    )}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-500">
        Staff Only
      </p>
      <h1 className="section-title mt-1 text-center">Table QR Codes 📱</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
        Print these QR codes and place one on each table. Customers scan to open
        the menu with their table number — orders come to your WhatsApp with the
        table number!
      </p>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => setTableCount(Math.max(1, tableCount - 1))}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:border-gold-500/50"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="text-lg font-bold text-zinc-100">{tableCount} Tables</span>
        <button
          onClick={() => setTableCount(Math.min(50, tableCount + 1))}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:border-gold-500/50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: tableCount }).map((_, i) => {
          const table = i + 1;
          return (
            <motion.div
              key={table}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: (i % 5) * 0.05 }}
              className="glass p-4 text-center"
            >
              <p className="mb-2 text-sm font-bold text-gold-400">Table {table}</p>
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-xl bg-white p-1">
                <img
                  src={qrUrl(table)}
                  alt={`QR for Table ${table}`}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">Scan to order</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-ink-900/60 p-6 text-center sm:p-8">
        <Printer className="mx-auto h-8 w-8 text-gold-400" />
        <h2 className="section-title mt-3">How to use</h2>
        <div className="mx-auto mt-4 max-w-2xl space-y-2 text-left text-sm text-zinc-400">
          <p>1. 🖨️ Print this page (Ctrl+P) or screenshot each QR code</p>
          <p>2. ✂️ Cut and laminate — place one QR on each table</p>
          <p>3. 📱 Customer scans → menu opens with table number</p>
          <p>4. 💬 Order comes to your WhatsApp with "Table 5" mentioned!</p>
        </div>
        <button onClick={() => window.print()} className="btn-gold mt-6">
          <Printer className="h-4 w-4" /> Print All QR Codes
        </button>
      </div>
    </div>
  );
}
