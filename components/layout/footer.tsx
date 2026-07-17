import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";

const CONTENT = DEFAULT_SITE_CONTENT;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-charcoal-950 pt-20">
      <Container>
        <div className="grid gap-14 pb-16 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-concrete-400">
              {CONTENT.footer.tagline}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-5">Explore</p>
            <ul className="space-y-3 text-sm text-concrete-300">
              {[
                ["About", "/about"],
                ["Services", "/services"],
                ["Gallery", "/gallery"],
                ["Founder", "/founder"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="link-underline transition hover:text-warmwhite">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Get in touch</p>
            <ul className="space-y-4 text-sm text-concrete-300">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <a href={`tel:${CONTENT.contact.phone.replace(/\s/g, "")}`} className="hover:text-warmwhite">
                  {CONTENT.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <a href={`mailto:${CONTENT.contact.email}`} className="hover:text-warmwhite">
                  {CONTENT.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span>{CONTENT.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-8 text-xs text-concrete-500 sm:flex-row">
          <p>
            &copy; {year} {CONTENT.footer.copyrightName}. All rights reserved.
          </p>
          <p>Built to last, since {DEFAULT_SITE_CONTENT.about.foundedYear}.</p>
        </div>
      </Container>
    </footer>
  );
}
