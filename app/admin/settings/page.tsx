import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck, Mail, Globe, KeyRound } from "lucide-react";

export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rows = [
    { icon: ShieldCheck, label: "Signed in as", value: user?.email ?? "—" },
    { icon: Mail, label: "Admin account", value: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "Set NEXT_PUBLIC_ADMIN_EMAIL" },
    { icon: Globe, label: "Site URL", value: process.env.NEXT_PUBLIC_SITE_URL ?? "Set NEXT_PUBLIC_SITE_URL" },
    { icon: KeyRound, label: "Auth method", value: "Supabase Email OTP (6-digit code, no password)" },
  ];

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-concrete-200 bg-white p-7">
        <h2 className="font-display text-lg font-semibold text-charcoal-900">Account &amp; Environment</h2>
        <div className="mt-5 divide-y divide-concrete-100">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-4 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warmwhite text-gold-600">
                <r.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-concrete-400">{r.label}</p>
                <p className="truncate text-sm text-charcoal-800">{r.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-concrete-200 bg-white p-7">
        <h2 className="font-display text-lg font-semibold text-charcoal-900">About this dashboard</h2>
        <p className="mt-2 text-sm leading-relaxed text-concrete-600">
          Only the account matching <code className="rounded bg-warmwhite px-1.5 py-0.5 text-xs">NEXT_PUBLIC_ADMIN_EMAIL</code> can
          reach this dashboard — everyone else who signs in gets a normal account with no admin access. To change who
          the admin is, update that environment variable and the matching check in{" "}
          <code className="rounded bg-warmwhite px-1.5 py-0.5 text-xs">supabase/schema.sql</code>, then re-run the
          updated SQL in the Supabase dashboard.
        </p>
      </div>
    </div>
  );
}
