import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { LinkButton } from "@/components/shared/button";
import { Animated, StaggerGroup, StaggerItem } from "@/components/shared/animated";
import type { AboutContent } from "@/lib/types";

const PILLARS = ["Residential", "Commercial", "Civil Construction"];

export function AboutTeaser({ content }: { content: AboutContent }) {
  return (
    <section className="bg-warmwhite py-28 sm:py-36">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <Animated>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] shadow-premium">
              <Image
                src="/images/project-institutional.jpg"
                alt="Completed institutional construction project by Shri Navnath Constructions"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/30 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-warmwhite/95 px-5 py-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-charcoal-900 font-display">{content.foundedYear}</p>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-concrete-500">Founded</p>
                  </div>
                  <div className="h-9 w-px bg-concrete-200" />
                  <div>
                    <p className="text-2xl font-bold text-charcoal-900 font-display">{content.yearsExperience}</p>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-concrete-500">Years Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </Animated>

          <div>
            <SectionHeading eyebrow="About Us" title={content.heading} />
            <Animated delay={0.15}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-concrete-700">{content.body}</p>
            </Animated>

            <StaggerGroup className="mt-9 flex flex-wrap gap-3">
              {PILLARS.map((p) => (
                <StaggerItem key={p}>
                  <span className="inline-flex items-center rounded-full border border-concrete-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-800">
                    {p}
                  </span>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Animated delay={0.3} className="mt-10">
              <LinkButton href="/about" variant="ghost" icon className="group !px-0">
                Read our full story
              </LinkButton>
            </Animated>
          </div>
        </div>
      </Container>
    </section>
  );
}
