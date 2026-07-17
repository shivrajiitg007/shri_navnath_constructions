import Image from "next/image";
import { Container } from "@/components/shared/container";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-charcoal-950 pb-16 pt-40">
      {image && (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-charcoal-950/40" />
        </>
      )}
      <Container className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-10 bg-gold-500" />
          <span className="eyebrow text-gold-400">{eyebrow}</span>
        </div>
        <h1 className="font-display max-w-3xl text-balance text-[2.5rem] font-medium leading-[1.05] tracking-tight text-warmwhite sm:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-concrete-300 sm:text-lg">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
