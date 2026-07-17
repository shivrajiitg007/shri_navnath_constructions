import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { GalleryGrid, type GalleryImage } from "@/components/gallery/gallery-grid";
import { Animated } from "@/components/shared/animated";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Real sites and structures built by Shri Navnath Constructions — residential, commercial and civil work across Akot, Maharashtra.",
};

const CORE_IMAGES: GalleryImage[] = [
  { src: "/images/project-structure.jpg", alt: "Structural framework under construction", caption: "Structural framing", tall: true },
  { src: "/images/project-campus.jpg", alt: "Institutional campus construction pathway", caption: "Institutional campus", tall: true },
  { src: "/images/project-institutional.jpg", alt: "Completed institutional building", caption: "Institutional building" },
  { src: "/images/project-residence-foundation.jpg", alt: "Residential construction at foundation stage", caption: "Foundation stage", tall: true },
  { src: "/images/project-residence-detail.jpg", alt: "Residential building architectural detail", caption: "Architectural detail", tall: true },
  { src: "/images/project-residence-facade.jpg", alt: "Completed residential building facade", caption: "Completed residence" },
];

export default async function GalleryPage() {
  let extraProjects: Project[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("is_hidden", false)
      .order("sort_order", { ascending: true });
    extraProjects = (data as Project[]) ?? [];
  } catch {
    // table may not exist yet — gallery still works with the core photo set
  }

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Years of craftsmanship, in frame"
        description="Real photographs from real sites — no stock imagery, no invented projects. This is what two decades of work looks like."
        image="/images/project-residence-facade.jpg"
      />

      <section className="bg-warmwhite py-24 sm:py-28">
        <Container>
          <GalleryGrid images={CORE_IMAGES} />
        </Container>
      </section>

      {extraProjects.length > 0 && (
        <section className="bg-charcoal-950 py-24 sm:py-28">
          <Container>
            <SectionHeading eyebrow="Recent Work" title="More from the field" light />
            <div className="mt-14">
              <GalleryGrid
                images={extraProjects
                  .filter((p) => p.cover_image)
                  .map((p) => ({
                    src: p.cover_image as string,
                    alt: p.title,
                    caption: [p.title, p.location].filter(Boolean).join(" — "),
                  }))}
              />
            </div>
          </Container>
        </section>
      )}

      <section className="bg-warmwhite py-20 text-center">
        <Container>
          <Animated>
            <p className="mx-auto max-w-md text-sm text-concrete-500">
              We don&apos;t publish a numbered project list — every client&apos;s site is different, and most of our
              work is spoken for through referrals. This gallery is simply a record of the craft.
            </p>
          </Animated>
        </Container>
      </section>
    </>
  );
}
