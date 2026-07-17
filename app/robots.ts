import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shrinavnathconstructions.com";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/profile", "/enquire/thank-you"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
