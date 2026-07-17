"use client";

import { useMemo, useState, useTransition } from "react";
import {
  ChevronDown,
  Phone,
  Mail,
  Trash2,
  Download,
  Paperclip,
  Search,
} from "lucide-react";
import { updateEnquiryStatus, deleteEnquiry } from "@/lib/actions/enquiries";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Enquiry, EnquiryStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: EnquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quotation_sent", label: "Quotation Sent" },
  { value: "project_started", label: "Project Started" },
  { value: "completed", label: "Completed" },
];

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  quotation_sent: "bg-purple-100 text-purple-700",
  project_started: "bg-teal-100 text-teal-700",
  completed: "bg-green-100 text-green-700",
};

function toCsv(rows: Enquiry[]) {
  const headers = ["Name", "Mobile", "Email", "Location", "Type", "Budget", "Status", "Received", "Description"];
  const lines = rows.map((r) =>
    [r.name, r.mobile, r.email ?? "", r.project_location ?? "", r.construction_type ?? "", r.budget ?? "", r.status, formatDateTime(r.created_at), (r.description ?? "").replace(/\n/g, " ")]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

export function EnquiriesTable({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<EnquiryStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false;
      if (search && !`${e.name} ${e.mobile} ${e.email ?? ""} ${e.project_location ?? ""}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [enquiries, filter, search]);

  function handleStatusChange(id: string, status: EnquiryStatus) {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    startTransition(() => { void updateEnquiryStatus(id, status); });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this enquiry permanently?")) return;
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    startTransition(() => { void deleteEnquiry(id); });
  }

  function handleExport() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn("rounded-full px-4 py-2 text-xs font-semibold", filter === "all" ? "bg-charcoal-900 text-warmwhite" : "bg-white text-concrete-600 border border-concrete-200")}
          >
            All ({enquiries.length})
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold capitalize",
                filter === s.value ? "bg-charcoal-900 text-warmwhite" : "bg-white text-concrete-600 border border-concrete-200"
              )}
            >
              {s.label} ({enquiries.filter((e) => e.status === s.value).length})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-concrete-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="rounded-full border border-concrete-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-gold-500"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-full bg-charcoal-900 px-4 py-2 text-xs font-semibold text-warmwhite hover:bg-charcoal-800"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-concrete-200 bg-white">
        {filtered.length === 0 && <p className="p-10 text-center text-sm text-concrete-400">No enquiries match this view.</p>}
        <div className="divide-y divide-concrete-100">
          {filtered.map((e) => (
            <div key={e.id}>
              <button
                onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-warmwhite/60"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <p className="truncate font-medium text-charcoal-900">{e.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLES[e.status]}`}>
                      {e.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-concrete-500">
                    {e.mobile} &middot; {e.construction_type} &middot; {formatDateTime(e.created_at)}
                  </p>
                </div>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-concrete-400 transition-transform", expanded === e.id && "rotate-180")} />
              </button>

              {expanded === e.id && (
                <div className="border-t border-concrete-100 bg-warmwhite/50 px-5 py-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-concrete-400">Location</p>
                      <p className="mt-1 text-sm text-charcoal-800">{e.project_location || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-concrete-400">Budget</p>
                      <p className="mt-1 text-sm text-charcoal-800">{e.budget || "Not specified"}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-concrete-400">Description</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-charcoal-800">{e.description}</p>
                    </div>
                    {e.attachment_url && (
                      <div className="sm:col-span-2">
                        <a
                          href={e.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700"
                        >
                          <Paperclip className="h-3.5 w-3.5" /> View attachment
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <a
                      href={`tel:${e.mobile.replace(/\s/g, "")}`}
                      className="flex items-center gap-1.5 rounded-full bg-charcoal-900 px-4 py-2 text-xs font-semibold text-warmwhite hover:bg-charcoal-800"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                    {e.email && (
                      <a
                        href={`mailto:${e.email}`}
                        className="flex items-center gap-1.5 rounded-full border border-concrete-300 bg-white px-4 py-2 text-xs font-semibold text-charcoal-800 hover:border-charcoal-400"
                      >
                        <Mail className="h-3.5 w-3.5" /> Email
                      </a>
                    )}
                    <select
                      value={e.status}
                      disabled={isPending}
                      onChange={(ev) => handleStatusChange(e.id, ev.target.value as EnquiryStatus)}
                      className="rounded-full border border-concrete-300 bg-white px-4 py-2 text-xs font-semibold text-charcoal-800 outline-none focus:border-gold-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>Mark as: {s.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="ml-auto flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
