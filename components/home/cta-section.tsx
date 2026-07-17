import { Container } from "@/components/shared/container";
import { Animated } from "@/components/shared/animated";
import { LinkButton } from "@/components/shared/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-warmwhite py-28 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full max-w-4xl -translate-x-1/2 bg-gold-500/[0.06] blur-3xl" />
      <Container>
        <Animated className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="beam-rule" />
            <span className="eyebrow">Start a project</span>
            <span className="beam-rule" />
          </div>
          <h2 className="font-display text-balance text-[2.25rem] leading-tight tracking-tight text-charcoal-900 sm:text-5xl">
            Ready to build something that lasts?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-concrete-600 sm:text-lg">
            Tell us about your project and we&apos;ll get back to you personally — no account, no hassle.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <LinkButton href="/enquire" variant="gold" icon>
              Request a Quote
            </LinkButton>
            <LinkButton href="/contact" variant="ghost">
              Contact us directly
            </LinkButton>
          </div>
        </Animated>
      </Container>
    </section>
  );
}
