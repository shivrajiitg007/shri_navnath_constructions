import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/shared/container";
import { createClient } from "@/lib/supabase/server";
import { User, Mail, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Your Profile", robots: { index: false, follow: false } };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <section className="min-h-[70vh] bg-warmwhite pb-24 pt-40">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="mb-8 flex items-center gap-3">
            <span className="beam-rule" />
            <span className="eyebrow">Account</span>
          </div>
          <h1 className="font-display text-3xl font-medium text-charcoal-900">Your Profile</h1>

          <div className="mt-10 rounded-[1.75rem] border border-concrete-200 bg-white p-8 shadow-premium">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-2xl font-bold text-charcoal-950">
                {user.email?.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-lg font-semibold text-charcoal-900">{profile?.full_name || "Account holder"}</p>
                <p className="text-sm capitalize text-concrete-500">{profile?.role ?? "user"}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4 border-t border-concrete-100 pt-6 text-sm">
              <div className="flex items-center gap-3 text-charcoal-800">
                <Mail className="h-4 w-4 text-gold-500" /> {user.email}
              </div>
              <div className="flex items-center gap-3 text-charcoal-800">
                <ShieldCheck className="h-4 w-4 text-gold-500" /> Role: <span className="capitalize">{profile?.role ?? "user"}</span>
              </div>
              {profile?.created_at && (
                <div className="flex items-center gap-3 text-charcoal-800">
                  <User className="h-4 w-4 text-gold-500" /> Member since {formatDate(profile.created_at)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
