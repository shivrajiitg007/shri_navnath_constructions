import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { LinkButton } from "@/components/shared/button";
import { Animated } from "@/components/shared/animated";
import { getSiteContent } from "@/lib/actions/content";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: true },
};

export default async function ThankYouPage() {
  const contact = await getSiteContent("contact");

  return (
    <section className="flex min-h-[80vh] items-center bg-warmwhite pt-28">
      <Container>
        <Animated className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-500/15">
            <CheckCircle2 className="h-10 w-10 text-gold-600" />
          </div>
          <h1 className="font-display mt-8 text-balance text-3xl font-medium text-charcoal-900 sm:text-4xl">
            Thank you — we&apos;ve received your enquiry
          </h1>
          <p className="mt-5 text-base leading-relaxed text-concrete-600">
            A confirmation has been sent to your email. Mr. Pundlik Wamanrao Jayale personally reviews every enquiry
            and will get back to you within 24 hours. For anything urgent, call {contact.phone} directly.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <LinkButton href="/" variant="primary">Back to Home</LinkButton>
            <LinkButton href="/gallery" variant="ghost">Browse our work</LinkButton>
          </div>
        </Animated>
      </Container>
    </section>
  );
}
