"use server";

import { createClient } from "@/lib/supabase/server";

export async function logActivity(action: string, details?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("activity_log").insert({
    actor_email: user?.email ?? null,
    action,
    details: details ?? null,
  });
}
