import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

// middleware.ts already blocks non-admins from /admin/*; this is a defense-in-depth
// server-side check for the layout itself (e.g. if middleware config ever changes).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return <AdminShell>{children}</AdminShell>;
}
