"use client";

export default function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-500/15 text-yellow-300",
    PREPARING: "bg-blue-500/15 text-blue-300",
    READY: "bg-green-500/15 text-green-300",
    DELIVERED: "bg-zinc-500/15 text-zinc-300",
    CANCELLED: "bg-red-500/15 text-red-300",
    CONFIRMED: "bg-green-500/15 text-green-300",
    REJECTED: "bg-red-500/15 text-red-300",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
        colors[status] ?? "bg-white/10 text-zinc-300"
      }`}
    >
      {status}
    </span>
  );
}
