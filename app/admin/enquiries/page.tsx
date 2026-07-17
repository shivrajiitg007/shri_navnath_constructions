import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { EnquiriesTable } from "@/components/admin/enquiries-table";
import type { Enquiry } from "@/lib/types";

export const metadata: Metadata = { title: "Enquiries", robots: { index: false, follow: false } };

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });

  return <EnquiriesTable initialEnquiries={(data as Enquiry[]) ?? []} />;
}
