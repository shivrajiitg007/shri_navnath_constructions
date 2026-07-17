import Image from "next/image";
import { Container } from "@/components/shared/container";
import { Animated } from "@/components/shared/animated";
import { LinkButton } from "@/components/shared/button";
import { Quote } from "lucide-react";

export function FounderTeaser() {
  return (
    <section className="bg-charcoal-950 py-28 sm:py-36">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Animated>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.75rem] shadow-premium">
              <Image
                src="/images/founder.jpg"
                alt="Mr. Pundlik Wamanrao Jayale, Founder of Shri Navnath Constructions"
                fill
                sizes="(min-width: 1024px) 30vw, 80vw"
                className="object-cover object-[center_25%]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal-950/80 to-transparent" />
            </div>
          </Animated>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="beam-rule" />
              <span className="eyebrow text-gold-400">The Founder</span>
            </div>
            <Quote className="mb-6 h-9 w-9 text-gold-500/40" />
            <p className="font-display text-balance text-2xl font-medium leading-snug text-warmwhite sm:text-3xl">
              &ldquo;A building is a promise to the people who&apos;ll live and work inside it. We&apos;ve kept that
              promise since 2005.&rdquo;
            </p>
            <p className="mt-7 text-base text-concrete-300">
              Mr. Pundlik Wamanrao Jayale founded Shri Navnath Constructions in Akot, Maharashtra, and has led every
              project personally for over two decades.
            </p>
            <Animated delay={0.2} className="mt-9">
              <LinkButton href="/founder" variant="secondary" icon>
                Meet the Founder
              </LinkButton>
            </Animated>
          </div>
        </div>
      </Container>
    </section>
  );
}
