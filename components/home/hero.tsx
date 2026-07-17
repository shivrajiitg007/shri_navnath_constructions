"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LinkButton } from "@/components/shared/button";
import { ChevronDown } from "lucide-react";
import type { HomepageContent } from "@/lib/types";

export function Hero({ content }: { content: HomepageContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="grain relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-charcoal-950">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={content.heroImage}
          alt="Structural framework of a Shri Navnath Constructions building project"
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/55 to-charcoal-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/70 via-transparent to-charcoal-950/40" />

      <motion.div style={{ opacity }} className="relative z-10 w-full pb-24 pt-40 sm:pb-32">
        <div className="mx-auto max-w-[1400px] container-px">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-px w-10 animate-grow-line bg-gold-500" />
            <span className="eyebrow text-gold-400">Est. 2005 &middot; Akot, Maharashtra</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-display max-w-4xl text-balance text-[2.75rem] font-medium leading-[1.04] tracking-tight text-warmwhite sm:text-6xl lg:text-[5.25rem]"
          >
            {content.heroHeading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-xl text-balance text-base leading-relaxed text-concrete-200 sm:text-lg"
          >
            {content.heroSubheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-11 flex flex-wrap items-center gap-4"
          >
            <LinkButton href="/enquire" variant="gold" icon>
              {content.heroButtonPrimary}
            </LinkButton>
            <LinkButton href="/about" variant="secondary">
              {content.heroButtonSecondary}
            </LinkButton>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-warmwhite/60"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
