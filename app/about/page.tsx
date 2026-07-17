import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/shared/container";
import { Animated, StaggerGroup, StaggerItem } from "@/components/shared/animated";
import { LinkButton } from "@/components/shared/button";
import { ShieldCheck, HandHeart, Hammer, Clock } from "lucide-react";
import { getSiteContent } from "@/lib/actions/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Shri Navnath Constructions has built residential, commercial and civil projects in Akot, Maharashtra since 2005 — 20+ years led personally by Mr. Pundlik Wamanrao Jayale.",
};

const VALUES = [
  { icon: ShieldCheck, title: "Trust first", desc: "Every quote, every timeline, every material choice — communicated honestly, from the first meeting onward." },
  { icon: Hammer, title: "Hands-on craft", desc: "The founder is on-site, not just in the office. Two decades of direct, personal involvement in every build." },
  { icon: HandHeart, title: "Relationships that last", desc: "Many of our clients come back for a second project, or send their family to us. That's not an accident." },
  { icon: Clock, title: "Built to stand", desc: "We build for decades, not just for handover day. Quality that holds up long after the paperwork is done." },
];

export default async function AboutPage() {
  const about = await getSiteContent("about");

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Two decades of building trust in Akot"
        description="A local construction company, built the old-fashioned way — one honest project at a time."
        image="/images/project-campus.jpg"
      />

      <section className="bg-warmwhite py-24 sm:py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <Animated>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-premium">
                <Image
                  src="/images/project-residence-facade.jpg"
                  alt="Completed residential construction by Shri Navnath Constructions"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
            </Animated>
            <div className="flex flex-col justify-center">
              <div className="mb-5 flex items-center gap-3">
                <span className="beam-rule" />
                <span className="eyebrow">Our Story</span>
              </div>
              <h2 className="font-display text-balance text-3xl font-medium leading-tight text-charcoal-900 sm:text-4xl">
                {about.heading}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-concrete-700">{about.body}</p>
              <p className="mt-5 text-base leading-relaxed text-concrete-700">
                Based in Akot, Maharashtra, the company has grown through word of mouth — a reputation earned on-site,
                project after project, rather than built through advertising. Today it works across residential,
                commercial, and civil construction, with the same founder-led approach it started with in{" "}
                {about.foundedYear}.
              </p>
              <div className="mt-10">
                <LinkButton href="/founder" variant="ghost" icon className="!px-0">
                  Meet the founder
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-charcoal-950 py-24 sm:py-32">
        <Container>
          <div className="mb-14 flex items-center gap-3">
            <span className="beam-rule" />
            <span className="eyebrow text-gold-400">What We Stand For</span>
          </div>
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <StaggerItem key={v.title}>
                <div className="card-hover h-full rounded-3xl border border-white/8 bg-white/[0.03] p-8">
                  <v.icon className="h-7 w-7 text-gold-400" strokeWidth={1.75} />
                  <h3 className="font-display mt-6 text-lg font-semibold text-warmwhite">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-concrete-400">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>
    </>
  );
}
