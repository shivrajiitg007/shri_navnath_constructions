import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProjectsManager } from "@/components/admin/projects-manager";
import type { Project } from "@/lib/types";

export const metadata: Metadata = { title: "Projects", robots: { index: false, follow: false } };

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });

  return <ProjectsManager initialProjects={(data as Project[]) ?? []} />;
}
