import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ActivityFeed } from "@/components/admin/activity-feed";
import type { ActivityLogEntry } from "@/lib/types";

export const metadata: Metadata = { title: "Activity Log", robots: { index: false, follow: false } };

export default async function AdminActivityPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(200);

  return <ActivityFeed entries={(data as ActivityLogEntry[]) ?? []} />;
}
