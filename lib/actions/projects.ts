"use server";

import { createClient } from "@/lib/supabase/server";
import { projectSchema, type ProjectFormValues } from "@/lib/validations";
import { logActivity } from "@/lib/actions/activity";
import { revalidatePath } from "next/cache";

export async function createProject(values: ProjectFormValues) {
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert({
    title: parsed.data.title,
    description: parsed.data.description || null,
    location: parsed.data.location || null,
    construction_type: parsed.data.construction_type || null,
    status: parsed.data.status,
    cover_image: parsed.data.cover_image || null,
    is_hidden: parsed.data.is_hidden ?? false,
  });
  if (!error) await logActivity("Project added", parsed.data.title);
  revalidatePath("/admin/projects");
  revalidatePath("/gallery");
  return { error: error?.message ?? null };
}

export async function updateProject(id: string, values: ProjectFormValues) {
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid data" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      construction_type: parsed.data.construction_type || null,
      status: parsed.data.status,
      cover_image: parsed.data.cover_image || null,
      is_hidden: parsed.data.is_hidden ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (!error) await logActivity("Project updated", parsed.data.title);
  revalidatePath("/admin/projects");
  revalidatePath("/gallery");
  return { error: error?.message ?? null };
}

export async function toggleProjectHidden(id: string, is_hidden: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update({ is_hidden }).eq("id", id);
  if (!error) await logActivity(is_hidden ? "Project hidden" : "Project shown", id);
  revalidatePath("/admin/projects");
  revalidatePath("/gallery");
  return { error: error?.message ?? null };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (!error) await logActivity("Project deleted", id);
  revalidatePath("/admin/projects");
  revalidatePath("/gallery");
  return { error: error?.message ?? null };
}
