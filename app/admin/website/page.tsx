import type { Metadata } from "next";
import { WebsiteEditor } from "@/components/admin/website-editor";
import { getSiteContent } from "@/lib/actions/content";

export const metadata: Metadata = { title: "Website Management", robots: { index: false, follow: false } };

export default async function AdminWebsitePage() {
  const [homepage, about, contact, footer] = await Promise.all([
    getSiteContent("homepage"),
    getSiteContent("about"),
    getSiteContent("contact"),
    getSiteContent("footer"),
  ]);

  return <WebsiteEditor content={{ homepage, about, contact, footer }} />;
}
