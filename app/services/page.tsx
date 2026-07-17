import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/shared/container";
import { Animated } from "@/components/shared/animated";
import { LinkButton } from "@/components/shared/button";
import { Building2, Factory, HardHat, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "Residential, commercial and civil construction services from Shri Navnath Constructions, Akot, Maharashtra.",
};

const SERVICES = [
  {
    icon: Building2,
    title: "Residential Construction",
    image: "/images/project-residence-facade.jpg",
    desc: "From individual homes to multi-family residences, we handle the full build — structure, finishing, and the details that make a house feel like it was built specifically for the people living in it.",
    points: ["Custom home construction", "Structural design coordination", "Interior & exterior finishing", "Renovations & additions"],
  },
  {
    icon: Factory,
    title: "Commercial Construction",
    image: "/images/project-institutional.jpg",
    desc: "Institutional and commercial buildings built to a professional standard — designed for durability and day-to-day function, not just appearances.",
    points: ["Institutional buildings", "Commercial complexes", "Site planning & layout", "Facade & finishing work"],
  },
  {
    icon: HardHat,
    title: "Civil Construction",
    image: "/images/project-structure.jpg",
    desc: "The structural backbone work — foundations, RCC framing, and civil infrastructure carried out with the same discipline that's defined this company since 2005.",
    points: ["RCC framing & foundations", "Structural civil works", "Site development", "Quality-controlled execution"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we build"
        description="Three disciplines, one standard of work — every project handled with the same personal attention since 2005."
        image="/images/project-residence-detail.jpg"
      />

      {SERVICES.map((s, i) => (
        <section key={s.title} className={i % 2 === 0 ? "bg-warmwhite" : "bg-charcoal-950"}>
          <Container className="py-24 sm:py-28">
            <div className={`grid items-center gap-14 lg:grid-cols-2 lg:gap-20 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <Animated>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-premium">
                  <Image src={s.image} alt={s.title} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
                </div>
              </Animated>
              <div>
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    i % 2 === 0 ? "bg-charcoal-900 text-gold-400" : "bg-gold-500/10 text-gold-400"
                  }`}
                >
                  <s.icon className="h-7 w-7" strokeWidth={1.75} />
                </div>
                <h2
                  className={`font-display mt-7 text-3xl font-medium leading-tight sm:text-4xl ${
                    i % 2 === 0 ? "text-charcoal-900" : "text-warmwhite"
                  }`}
                >
                  {s.title}
                </h2>
                <p className={`mt-5 text-base leading-relaxed ${i % 2 === 0 ? "text-concrete-700" : "text-concrete-400"}`}>
                  {s.desc}
                </p>
                <ul className="mt-7 space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className={`flex items-center gap-3 text-sm ${i % 2 === 0 ? "text-charcoal-800" : "text-concrete-300"}`}>
                      <Check className="h-4 w-4 shrink-0 text-gold-500" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>
      ))}

      <section className="bg-warmwhite py-24 text-center sm:py-28">
        <Container>
          <Animated>
            <h2 className="font-display mx-auto max-w-xl text-balance text-3xl font-medium text-charcoal-900 sm:text-4xl">
              Have a project in mind?
            </h2>
            <div className="mt-9">
              <LinkButton href="/enquire" variant="gold" icon>
                Request a Quote
              </LinkButton>
            </div>
          </Animated>
        </Container>
      </section>
    </>
  );
}
