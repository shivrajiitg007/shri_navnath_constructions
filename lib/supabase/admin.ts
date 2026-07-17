import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client. NEVER import this into a client component or expose
// the key to the browser — it bypasses Row Level Security entirely.
// Used only for privileged server-side operations, e.g. storing a file a
// signed-out visitor attached to a public enquiry.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
