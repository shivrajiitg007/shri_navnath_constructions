"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enquirySchema, type EnquiryFormValues } from "@/lib/validations";
import { logActivity } from "@/lib/actions/activity";
import type { EnquiryStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function submitEnquiry(values: EnquiryFormValues, attachment?: File | null) {
  const parsed = enquirySchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Please check the form and try again." };
  }

  let attachment_url: string | null = null;

  if (attachment && attachment.size > 0) {
    try {
      const admin = createAdminClient();
      const bytes = Buffer.from(await attachment.arrayBuffer());
      const safeName = attachment.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `enquiries/${Date.now()}-${safeName}`;
      const { error: uploadError } = await admin.storage.from("media").upload(path, bytes, {
        contentType: attachment.type || "application/octet-stream",
        upsert: false,
      });
      if (!uploadError) {
        const { data } = admin.storage.from("media").getPublicUrl(path);
        attachment_url = data.publicUrl;
      }
    } catch {
      // attachment upload is best-effort; the enquiry itself must still go through
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").insert({
    name: parsed.data.name,
    mobile: parsed.data.mobile,
    email: parsed.data.email || null,
    project_location: parsed.data.project_location || null,
    construction_type: parsed.data.construction_type,
    budget: parsed.data.budget || null,
    description: parsed.data.description,
    attachment_url,
  });

  if (error) return { error: "Something went wrong submitting your enquiry. Please try again." };

  if (parsed.data.email) {
    // Best-effort confirmation email — deploy the send-enquiry-email Supabase
    // Edge Function (see supabase/functions/) and set RESEND_API_KEY for this
    // to actually send. Never blocks the enquiry from succeeding.
    supabase.functions
      .invoke("send-enquiry-email", { body: { name: parsed.data.name, email: parsed.data.email } })
      .catch(() => {});
  }

  return { error: null };
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (!error) await logActivity("Enquiry status updated", `#${id.slice(0, 8)} -> ${status}`);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { error: error?.message ?? null };
}

export async function deleteEnquiry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (!error) await logActivity("Enquiry deleted", `#${id.slice(0, 8)}`);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { error: error?.message ?? null };
}
