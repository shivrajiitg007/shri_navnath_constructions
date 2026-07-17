import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/shared/container";
import { Animated } from "@/components/shared/animated";
import { EnquiryForm } from "@/components/enquiry/enquiry-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSiteContent } from "@/lib/actions/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Shri Navnath Constructions, Akot, Maharashtra. Call, email, or send your project details directly.",
};

export default async function ContactPage() {
  const contact = await getSiteContent("contact");
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(contact.mapsQuery)}&z=13&output=embed`;

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk about your project" description="Reach out directly, or send us the details below." />

      <section className="bg-warmwhite py-24 sm:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Animated>
                <div className="space-y-5">
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="card-hover flex items-center gap-4 rounded-2xl border border-concrete-200 bg-white p-6 transition hover:border-gold-400"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-charcoal-900 text-gold-400">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-concrete-500">Call us</p>
                      <p className="mt-0.5 font-medium text-charcoal-900">{contact.phone}</p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="card-hover flex items-center gap-4 rounded-2xl border border-concrete-200 bg-white p-6 transition hover:border-gold-400"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-charcoal-900 text-gold-400">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-concrete-500">Email us</p>
                      <p className="mt-0.5 font-medium text-charcoal-900">{contact.email}</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 rounded-2xl border border-concrete-200 bg-white p-6">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-charcoal-900 text-gold-400">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-concrete-500">Based in</p>
                      <p className="mt-0.5 font-medium text-charcoal-900">{contact.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border border-concrete-200 bg-white p-6">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-charcoal-900 text-gold-400">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-concrete-500">Response time</p>
                      <p className="mt-0.5 font-medium text-charcoal-900">We personally respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </Animated>

              <Animated delay={0.15} className="mt-6 overflow-hidden rounded-2xl border border-concrete-200">
                <iframe
                  title="Shri Navnath Constructions location"
                  src={mapSrc}
                  className="h-64 w-full grayscale-[20%]"
                  loading="lazy"
                />
              </Animated>
            </div>

            <Animated delay={0.1}>
              <div className="rounded-[1.75rem] border border-concrete-200 bg-white p-8 shadow-premium sm:p-10">
                <h2 className="font-display text-2xl font-semibold text-charcoal-900">Send your project details</h2>
                <p className="mt-2 text-sm text-concrete-600">No account needed — we&apos;ll get back to you directly.</p>
                <div className="mt-8">
                  <EnquiryForm />
                </div>
              </div>
            </Animated>
          </div>
        </Container>
      </section>
    </>
  );
}
