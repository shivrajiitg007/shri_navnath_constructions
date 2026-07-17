import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/shared/container";
import { Animated } from "@/components/shared/animated";
import { LinkButton } from "@/components/shared/button";
import { Quote, Phone, Mail } from "lucide-react";
import { getSiteContent } from "@/lib/actions/content";

export const metadata: Metadata = {
  title: "Our Founder",
  description: "Meet Mr. Pundlik Wamanrao Jayale, founder of Shri Navnath Constructions, Akot, Maharashtra — 20+ years in construction.",
};

export default async function FounderPage() {
  const contact = await getSiteContent("contact");

  return (
    <>
      <PageHero eyebrow="Founder" title="The person behind every project" />

      <section className="bg-warmwhite py-24 sm:py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Animated>
              <div className="lg:sticky lg:top-32">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] shadow-premium">
                  <Image
                    src="/images/founder.jpg"
                    alt="Mr. Pundlik Wamanrao Jayale, Founder of Shri Navnath Constructions"
                    fill
                    sizes="(min-width: 1024px) 35vw, 90vw"
                    className="object-cover object-[center_25%]"
                  />
                </div>
                <div className="mt-6">
                  <p className="font-display text-xl font-semibold text-charcoal-900">Mr. Pundlik Wamanrao Jayale</p>
                  <p className="mt-1 text-sm font-medium text-gold-600">Founder, Shri Navnath Constructions</p>
                  <div className="mt-5 flex flex-col gap-2.5 text-sm text-concrete-600">
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 hover:text-charcoal-900">
                      <Phone className="h-4 w-4 text-gold-500" /> {contact.phone}
                    </a>
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 hover:text-charcoal-900">
                      <Mail className="h-4 w-4 text-gold-500" /> {contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </Animated>

            <div>
              <Quote className="h-10 w-10 text-gold-500/30" />
              <p className="font-display mt-5 text-balance text-2xl font-medium leading-snug text-charcoal-900 sm:text-3xl">
                &ldquo;I&apos;ve never treated a project as just a contract. Every site is somebody&apos;s home, or
                somebody&apos;s business — I build it the way I&apos;d build it for my own family.&rdquo;
              </p>

              <div className="mt-10 space-y-5 text-base leading-relaxed text-concrete-700">
                <p>
                  Mr. Pundlik Wamanrao Jayale founded Shri Navnath Constructions in 2005 in Akot, Maharashtra. What
                  started as a small, local contracting operation has grown — through more than 20 years of
                  hands-on, personal involvement — into a trusted name across residential, commercial, and civil
                  construction in the region.
                </p>
                <p>
                  Unlike larger firms where the founder is a name on a letterhead, Mr. Jayale remains directly
                  involved on-site, overseeing quality at every stage from foundation to handover. That personal
                  standard is the reason the company has built its client base almost entirely through referrals and
                  repeat work.
                </p>
                <p>
                  Today, Shri Navnath Constructions continues to operate on the same principle it was founded on:
                  build every structure as though your own name is on it — because it is.
                </p>
              </div>

              <div className="mt-10">
                <LinkButton href="/contact" variant="gold" icon>
                  Get in touch directly
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
