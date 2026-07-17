import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";
import { Inbox, Building2, Users, Image as ImageIcon, ArrowUpRight } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { Enquiry, ActivityLogEntry } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  quotation_sent: "bg-purple-100 text-purple-700",
  project_started: "bg-teal-100 text-teal-700",
  completed: "bg-green-100 text-green-700",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: enquiryCount }, { count: newEnquiryCount }, { count: projectCount }, { count: employeeCount }, { count: mediaCount }, { data: recentEnquiries }, { data: recentActivity }] =
    await Promise.all([
      supabase.from("enquiries").select("*", { count: "exact", head: true }),
      supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("employees").select("*", { count: "exact", head: true }),
      supabase.from("media").select("*", { count: "exact", head: true }),
      supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(8),
    ]);

  const enquiries = (recentEnquiries as Enquiry[]) ?? [];
  const activity = (recentActivity as ActivityLogEntry[]) ?? [];

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Inbox} label="New enquiries" value={newEnquiryCount ?? 0} accent />
        <StatCard icon={Inbox} label="Total enquiries" value={enquiryCount ?? 0} />
        <StatCard icon={Building2} label="Projects" value={projectCount ?? 0} />
        <StatCard icon={Users} label="Employees" value={employeeCount ?? 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-concrete-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-charcoal-900">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-5 divide-y divide-concrete-100">
            {enquiries.length === 0 && <p className="py-8 text-center text-sm text-concrete-400">No enquiries yet.</p>}
            {enquiries.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-charcoal-900">{e.name}</p>
                  <p className="truncate text-xs text-concrete-500">
                    {e.construction_type} &middot; {e.mobile}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[e.status]}`}>
                  {e.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-concrete-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-charcoal-900">Recent Activity</h2>
            <Link href="/admin/activity" className="flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-5 space-y-5">
            {activity.length === 0 && <p className="py-8 text-center text-sm text-concrete-400">No activity yet.</p>}
            {activity.map((a) => (
              <div key={a.id} className="relative pl-5">
                <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-gold-500" />
                <p className="text-sm text-charcoal-800">{a.action}</p>
                {a.details && <p className="text-xs text-concrete-500">{a.details}</p>}
                <p className="mt-0.5 text-[11px] text-concrete-400">{formatDateTime(a.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-concrete-300 bg-white/60 p-5">
        <p className="text-xs text-concrete-500">
          Quick links: <Link href="/admin/media" className="font-medium text-gold-600">Media Library ({mediaCount ?? 0} files)</Link>
          {"  ·  "}
          <Link href="/admin/website" className="font-medium text-gold-600">Edit homepage &amp; content</Link>
        </p>
      </div>
    </div>
  );
}
