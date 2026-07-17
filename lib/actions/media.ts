"use server";

import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/actions/activity";
import { revalidatePath } from "next/cache";

export async function uploadMedia(file: File, folder: string = "general") {
  if (!file || file.size === 0) return { error: "No file provided", url: null };

  const supabase = await createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from("media").upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
  });
  if (uploadError) return { error: uploadError.message, url: null };

  const { data } = supabase.storage.from("media").getPublicUrl(path);

  const { error: dbError } = await supabase.from("media").insert({
    url: data.publicUrl,
    filename: file.name,
    folder,
    size_kb: Math.round(file.size / 1024),
  });
  if (dbError) return { error: dbError.message, url: null };

  await logActivity("Media uploaded", file.name);
  revalidatePath("/admin/media");
  return { error: null, url: data.publicUrl };
}

export async function renameMedia(id: string, filename: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("media").update({ filename }).eq("id", id);
  if (!error) await logActivity("Media renamed", filename);
  revalidatePath("/admin/media");
  return { error: error?.message ?? null };
}

export async function deleteMedia(id: string, url: string) {
  const supabase = await createClient();
  try {
    const marker = "/storage/v1/object/public/media/";
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      const path = decodeURIComponent(url.slice(idx + marker.length));
      await supabase.storage.from("media").remove([path]);
    }
  } catch {
    // if parsing the storage path fails we still remove the DB row below
  }
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (!error) await logActivity("Media deleted", id);
  revalidatePath("/admin/media");
  return { error: error?.message ?? null };
}
