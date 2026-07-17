"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Animated } from "@/components/shared/animated";

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  tall?: boolean;
}

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <Animated key={img.src} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
            <button
              onClick={() => setActiveIndex(i)}
              className="group relative block w-full overflow-hidden rounded-2xl"
              style={{ aspectRatio: img.tall ? "3/4" : "4/3" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="p-5 text-sm font-medium text-warmwhite">{img.caption}</span>
              </div>
            </button>
          </Animated>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/95 p-4 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <button
              className="absolute right-5 top-5 text-warmwhite/70 transition hover:text-warmwhite"
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
            >
              <X className="h-7 w-7" />
            </button>

            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 text-warmwhite/60 transition hover:text-warmwhite sm:left-8"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((activeIndex - 1 + images.length) % images.length);
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-9 w-9" />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-warmwhite/60 transition hover:text-warmwhite sm:right-8"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((activeIndex + 1) % images.length);
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-9 w-9" />
            </button>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-[80vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-concrete-300">
              {images[activeIndex].caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
