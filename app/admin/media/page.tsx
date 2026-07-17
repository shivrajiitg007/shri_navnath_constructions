import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MediaLibrary } from "@/components/admin/media-library";
import type { MediaItem } from "@/lib/types";

export const metadata: Metadata = { title: "Media Library", robots: { index: false, follow: false } };

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("media").select("*").order("uploaded_at", { ascending: false });

  return <MediaLibrary initialMedia={(data as MediaItem[]) ?? []} />;
}
