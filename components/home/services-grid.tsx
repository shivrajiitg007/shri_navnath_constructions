import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/shared/animated";
import { Building2, Factory, HardHat } from "lucide-react";

const SERVICES = [
  {
    icon: Building2,
    title: "Residential Construction",
    desc: "Homes built for the way families actually live — from first foundation to final finish, with attention to detail throughout.",
  },
  {
    icon: Factory,
    title: "Commercial Construction",
    desc: "Institutional and commercial buildings engineered for durability, function, and a professional standard of finish.",
  },
  {
    icon: HardHat,
    title: "Civil Construction",
    desc: "Structural and civil works carried out with the discipline of a team that has been on-site since 2005.",
  },
];

export function ServicesGrid() {
  return (
    <section className="bg-charcoal-950 py-28 sm:py-36">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Built on three disciplines"
          description="Two decades of hands-on experience across every scale of construction — from a family home to institutional infrastructure."
          light
        />

        <StaggerGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <StaggerItem key={s.title}>
              <div className="group card-hover h-full rounded-3xl border border-white/8 bg-white/[0.03] p-9 transition-colors hover:border-gold-500/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-charcoal-950">
                  <s.icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="font-display mt-7 text-xl font-semibold text-warmwhite">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-concrete-400">{s.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
