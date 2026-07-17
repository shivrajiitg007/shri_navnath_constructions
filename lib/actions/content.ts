import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";
import type { SiteContentMap } from "@/lib/types";

// Reads editable site content from Supabase, falling back to the shipped
// defaults if the table is empty or unreachable (e.g. before first admin edit).
export async function getSiteContent<K extends keyof SiteContentMap>(
  key: K
): Promise<SiteContentMap[K]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_content").select("value").eq("key", key).single();
    if (data?.value) {
      return { ...DEFAULT_SITE_CONTENT[key], ...(data.value as object) } as SiteContentMap[K];
    }
  } catch {
    // table may not exist yet if Supabase hasn't been provisioned — fall back silently
  }
  return DEFAULT_SITE_CONTENT[key];
}
