import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-concrete-200 bg-white p-6">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          accent ? "bg-gold-500 text-charcoal-950" : "bg-charcoal-900 text-gold-400"
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={1.9} />
      </div>
      <p className="mt-5 font-display text-3xl font-semibold text-charcoal-900">{value}</p>
      <p className="mt-1 text-sm text-concrete-500">{label}</p>
    </div>
  );
}
