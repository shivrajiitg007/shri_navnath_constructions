import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server component / server action client. Reads and (where possible) writes
// the Supabase auth cookies for the current request.
// Next.js 15+: cookies() is async, so this factory is async too — always
// call it as `const supabase = await createClient()`.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component with no request context to write to.
            // Safe to ignore as long as middleware.ts is refreshing the session.
          }
        },
      },
    }
  );
}
