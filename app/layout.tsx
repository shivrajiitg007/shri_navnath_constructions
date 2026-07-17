import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { LoginModal } from "@/components/auth/login-modal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SITE_NAME } from "@/lib/site-content";

// Self-hosted (not fetched from Google Fonts at build time — same OFL-licensed
// files, just bundled locally for faster, more reliable builds & no external
// request at runtime). Both are variable fonts, so one file covers the full
// weight range.
const inter = localFont({
  src: "./fonts/inter-variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
const plusJakarta = localFont({
  src: "./fonts/plus-jakarta-sans-variable.woff2",
  variable: "--font-plus-jakarta",
  weight: "200 800",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shrinavnathconstructions.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} | Residential, Commercial & Civil Construction in Akot`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Shri Navnath Constructions has been building trust in Akot, Maharashtra since 2005 — residential, commercial and civil construction led personally by Mr. Pundlik Wamanrao Jayale.",
  keywords: [
    "Shri Navnath Constructions",
    "construction company Akot",
    "Maharashtra construction company",
    "residential construction Akot",
    "civil construction Maharashtra",
    "Pundlik Jayale",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Building Trust Since 2005`,
    description: "Residential, commercial & civil construction in Akot, Maharashtra — trusted since 2005.",
    images: [{ url: "/images/project-structure.jpg", width: 1800, height: 2400, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Building Trust Since 2005`,
    description: "Residential, commercial & civil construction in Akot, Maharashtra — trusted since 2005.",
    images: ["/images/project-structure.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0C0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-body">
        <AuthProvider>
          <Navbar />
          <LoginModal />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
