// Supabase Edge Function (Deno). Deploy with:
//   supabase functions deploy send-enquiry-email
//   supabase secrets set RESEND_API_KEY=... RESEND_FROM_EMAIL=...
//
// Sends a confirmation email to the visitor who submitted the public
// Enquire Now form. Called from lib/actions/enquiries.ts right after the
// enquiry row is inserted. Best-effort: if this fails, the enquiry is
// still saved in Supabase and visible in the admin CRM.

// deno-lint-ignore-file no-explicit-any
// @ts-nocheck — this file runs on Deno, not the Next.js Node/TS toolchain.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "enquiries@shrinavnathconstructions.com";
const COMPANY_NAME = "Shri Navnath Constructions";
const COMPANY_PHONE = "+91 9168522412";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { name, email } = await req.json();

    if (!email || !RESEND_API_KEY) {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #0B0C0E;">
        <div style="height: 4px; background: #B08A4E;"></div>
        <div style="padding: 32px 8px;">
          <h1 style="font-size: 20px;">Thank you, ${name || "there"}.</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #44474D;">
            We've received your enquiry at ${COMPANY_NAME}. Mr. Pundlik Wamanrao Jayale personally
            reviews every enquiry and will get back to you within 24 hours.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #44474D;">
            Need to reach us sooner? Call ${COMPANY_PHONE}.
          </p>
          <p style="font-size: 13px; color: #8A8D92; margin-top: 32px;">— ${COMPANY_NAME}</p>
        </div>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${COMPANY_NAME} <${RESEND_FROM_EMAIL}>`,
        to: [email],
        subject: `We've received your enquiry — ${COMPANY_NAME}`,
        html,
      }),
    });

    const ok = res.ok;
    return new Response(JSON.stringify({ sent: ok }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: ok ? 200 : 502,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
