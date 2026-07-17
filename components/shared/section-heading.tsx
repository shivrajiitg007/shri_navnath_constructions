"use client";

import { Animated } from "./animated";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Animated>
          <div className={cn("mb-5 flex items-center gap-3", align === "center" && "justify-center")}>
            <span className="beam-rule" />
            <span className="eyebrow">{eyebrow}</span>
          </div>
        </Animated>
      )}
      <Animated delay={0.08}>
        <h2
          className={cn(
            "font-display text-balance text-[2.1rem] leading-[1.08] tracking-tight sm:text-[2.75rem] lg:text-[3.25rem]",
            light ? "text-warmwhite" : "text-charcoal-900"
          )}
        >
          {title}
        </h2>
      </Animated>
      {description && (
        <Animated delay={0.16}>
          <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", light ? "text-concrete-200" : "text-concrete-700")}>
            {description}
          </p>
        </Animated>
      )}
    </div>
  );
}
