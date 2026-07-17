import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { LinkButton } from "@/components/shared/button";
import { Animated } from "@/components/shared/animated";

const IMAGES = [
  { src: "/images/project-structure.jpg", alt: "Structural framework under construction", span: "row-span-2" },
  { src: "/images/project-campus.jpg", alt: "Institutional campus construction pathway", span: "" },
  { src: "/images/project-residence-facade.jpg", alt: "Completed residential building facade", span: "" },
  { src: "/images/project-residence-detail.jpg", alt: "Residential construction architectural detail", span: "" },
];

export function GalleryTeaser() {
  return (
    <section className="bg-warmwhite py-28 sm:py-36">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Our Work"
            title="Years of craftsmanship, in frame"
            description="A look at real sites and structures — not a portfolio of numbers, but a record of work done with care since 2005."
          />
          <Animated delay={0.2}>
            <LinkButton href="/gallery" variant="ghost" icon className="!px-0">
              View full gallery
            </LinkButton>
          </Animated>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-rows-2 lg:[grid-template-rows:repeat(2,220px)]">
          {IMAGES.map((img, i) => (
            <Animated key={img.src} delay={i * 0.08} className={`relative overflow-hidden rounded-2xl ${img.span} ${i === 0 ? "col-span-2 lg:col-span-1" : ""}`}>
              <div className="group relative h-full min-h-[220px] w-full overflow-hidden rounded-2xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal-950/0 transition-colors duration-500 group-hover:bg-charcoal-950/20" />
              </div>
            </Animated>
          ))}
        </div>
      </Container>
    </section>
  );
}
