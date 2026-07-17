"use server";

import { createClient } from "@/lib/supabase/server";
import { employeeSchema, type EmployeeFormValues } from "@/lib/validations";
import { logActivity } from "@/lib/actions/activity";
import { revalidatePath } from "next/cache";

export async function createEmployee(values: EmployeeFormValues) {
  const parsed = employeeSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const supabase = await createClient();
  const { error } = await supabase.from("employees").insert({
    name: parsed.data.name,
    designation: parsed.data.designation || null,
    experience_years: parsed.data.experience_years ?? null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    photo_url: parsed.data.photo_url || null,
  });
  if (!error) await logActivity("Employee added", parsed.data.name);
  revalidatePath("/admin/employees");
  return { error: error?.message ?? null };
}

export async function updateEmployee(id: string, values: EmployeeFormValues) {
  const parsed = employeeSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("employees")
    .update({
      name: parsed.data.name,
      designation: parsed.data.designation || null,
      experience_years: parsed.data.experience_years ?? null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      photo_url: parsed.data.photo_url || null,
    })
    .eq("id", id);
  if (!error) await logActivity("Employee updated", parsed.data.name);
  revalidatePath("/admin/employees");
  return { error: error?.message ?? null };
}

export async function deleteEmployee(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (!error) await logActivity("Employee removed", id);
  revalidatePath("/admin/employees");
  return { error: error?.message ?? null };
}
