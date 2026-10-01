import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            accent ? "bg-gold-500/20 text-gold-400" : "bg-white/5 text-zinc-400"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-zinc-50">{value}</p>
    </div>
  );
}
