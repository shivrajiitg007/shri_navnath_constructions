import type { SiteContentMap } from "./types";

// Fallback content shown until the admin overrides it from /admin/website.
// These defaults come directly from the brief, not placeholder copy.
export const DEFAULT_SITE_CONTENT: SiteContentMap = {
  homepage: {
    heroImage: "/images/project-structure.jpg",
    heroHeading: "Building Trust Since 2005",
    heroSubheading: "Strong foundations. Lasting relationships. Quality that stands the test of time.",
    heroButtonPrimary: "Request a Quote",
    heroButtonSecondary: "Explore Our Story",
  },
  about: {
    heading: "Two decades of building Akot, one project at a time",
    body: "Shri Navnath Constructions was founded in 2005 by Mr. Pundlik Wamanrao Jayale in Akot, Maharashtra. What began as a small local contracting practice has grown into a trusted name across residential, commercial, and civil construction — built on a simple principle: do the work right, and the relationships take care of themselves. Every foundation we pour, every structure we hand over, carries that same standard.",
    foundedYear: "2005",
    yearsExperience: "20+",
  },
  contact: {
    phone: "+91 9168522412",
    email: "pundlikwjayale@gmail.com",
    address: "Akot, Maharashtra, India",
    mapsQuery: "Akot, Maharashtra, India",
  },
  footer: {
    tagline: "Residential, commercial & civil construction in Akot, Maharashtra.",
    copyrightName: "Shri Navnath Constructions",
  },
};

export const SITE_NAME = "Shri Navnath Constructions";
export const SITE_SHORT = "SNC";
