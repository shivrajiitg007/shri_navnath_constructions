import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/shared/container";
import { Animated } from "@/components/shared/animated";
import { EnquiryForm } from "@/components/enquiry/enquiry-form";
import { Phone, ShieldCheck, Clock3 } from "lucide-react";
import { getSiteContent } from "@/lib/actions/content";

export const metadata: Metadata = {
  title: "Enquire Now",
  description: "Request a quote from Shri Navnath Constructions — no account required. Tell us about your project and we'll respond directly.",
};

export default async function EnquirePage() {
  const contact = await getSiteContent("contact");

  return (
    <>
      <PageHero
        eyebrow="Enquire Now"
        title="Tell us about your project"
        description="No sign-up, no account — just the details, and we'll take it from there."
      />

      <section className="bg-warmwhite py-24 sm:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <Animated>
              <div className="space-y-8 lg:sticky lg:top-32">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-charcoal-900">What happens next</h2>
                  <ul className="mt-6 space-y-5">
                    <li className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm font-bold text-gold-600">1</span>
                      <p className="text-sm leading-relaxed text-concrete-600">You share your project details — no account or login required.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm font-bold text-gold-600">2</span>
                      <p className="text-sm leading-relaxed text-concrete-600">We personally review it and reach out by phone or email, usually within a day.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm font-bold text-gold-600">3</span>
                      <p className="text-sm leading-relaxed text-concrete-600">We discuss scope, timeline, and a quote — no pressure, no obligation.</p>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 border-t border-concrete-200 pt-8">
                  <div className="flex items-center gap-3 text-sm text-concrete-600">
                    <ShieldCheck className="h-4 w-4 text-gold-500" /> Your details go straight to us — never shared or sold.
                  </div>
                  <div className="flex items-center gap-3 text-sm text-concrete-600">
                    <Clock3 className="h-4 w-4 text-gold-500" /> We personally respond within 24 hours.
                  </div>
                  <div className="flex items-center gap-3 text-sm text-concrete-600">
                    <Phone className="h-4 w-4 text-gold-500" />
                    Prefer to talk now? Call{" "}
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="font-medium text-charcoal-900 hover:text-gold-600">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </Animated>

            <Animated delay={0.1}>
              <div className="rounded-[1.75rem] border border-concrete-200 bg-white p-8 shadow-premium sm:p-10">
                <EnquiryForm />
              </div>
            </Animated>
          </div>
        </Container>
      </section>
    </>
  );
}
