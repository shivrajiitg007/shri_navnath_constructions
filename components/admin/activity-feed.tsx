import { Activity } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { ActivityLogEntry } from "@/lib/types";

export function ActivityFeed({ entries }: { entries: ActivityLogEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-concrete-300 bg-white p-14 text-center">
        <Activity className="mx-auto h-8 w-8 text-concrete-300" />
        <p className="mt-3 text-sm text-concrete-500">No activity recorded yet. Every change you make in the dashboard will show up here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-concrete-200 bg-white">
      <div className="divide-y divide-concrete-100">
        {entries.map((a) => (
          <div key={a.id} className="flex items-start gap-4 px-5 py-4">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold-500" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-charcoal-900">{a.action}</p>
              {a.details && <p className="text-sm text-concrete-500">{a.details}</p>}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-concrete-400">{formatDateTime(a.created_at)}</p>
              {a.actor_email && <p className="text-[11px] text-concrete-400">{a.actor_email}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
