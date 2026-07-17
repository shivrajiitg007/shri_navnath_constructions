"use server";

import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/actions/activity";
import { revalidatePath } from "next/cache";
import type { SiteContentMap } from "@/lib/types";

export async function updateSiteContent<K extends keyof SiteContentMap>(key: K, value: SiteContentMap[K]) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (!error) await logActivity("Website content updated", key);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/founder");
  revalidatePath("/contact");
  revalidatePath("/enquire");
  revalidatePath("/admin/website");
  return { error: error?.message ?? null };
}
