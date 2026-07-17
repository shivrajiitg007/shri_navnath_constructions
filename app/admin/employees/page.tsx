import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { EmployeesManager } from "@/components/admin/employees-manager";
import type { Employee } from "@/lib/types";

export const metadata: Metadata = { title: "Employees", robots: { index: false, follow: false } };

export default async function AdminEmployeesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("employees").select("*").order("created_at", { ascending: false });

  return <EmployeesManager initialEmployees={(data as Employee[]) ?? []} />;
}
