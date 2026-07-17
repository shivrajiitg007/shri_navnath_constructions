export type UserRole = "admin" | "user";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export type ProjectStatus = "ongoing" | "completed";

export interface Project {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  construction_type: string | null;
  status: ProjectStatus;
  cover_image: string | null;
  images: string[];
  is_hidden: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  designation: string | null;
  experience_years: number | null;
  phone: string | null;
  email: string | null;
  photo_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  folder: string;
  size_kb: number | null;
  uploaded_at: string;
}

export type EnquiryStatus = "new" | "contacted" | "quotation_sent" | "project_started" | "completed";

export interface Enquiry {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  project_location: string | null;
  construction_type: string | null;
  budget: string | null;
  description: string | null;
  attachment_url: string | null;
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogEntry {
  id: string;
  actor_email: string | null;
  action: string;
  details: string | null;
  created_at: string;
}

export interface HomepageContent {
  heroImage: string;
  heroHeading: string;
  heroSubheading: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
}

export interface AboutContent {
  heading: string;
  body: string;
  foundedYear: string;
  yearsExperience: string;
}

export interface ContactContent {
  phone: string;
  email: string;
  address: string;
  mapsQuery: string;
}

export interface FooterContent {
  tagline: string;
  copyrightName: string;
}

export interface SiteContentMap {
  homepage: HomepageContent;
  about: AboutContent;
  contact: ContactContent;
  footer: FooterContent;
}
