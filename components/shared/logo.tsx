import Link from "next/link";
import { cn } from "@/lib/utils";

// Live wordmark rendered with real site fonts (crisper than a rasterized image).
// Static brand-asset SVG/PNG files also ship in /public/logo for external use.
export function Logo({ light = false, className, href = "/" }: { light?: boolean; className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group flex items-center gap-3", className)} aria-label="Shri Navnath Constructions — Home">
      <svg viewBox="0 0 100 100" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect x="14" y="50" width="18" height="30" rx="5" className={light ? "fill-warmwhite" : "fill-charcoal-900"} />
        <rect x="41" y="32" width="18" height="48" rx="5" className={light ? "fill-warmwhite" : "fill-charcoal-900"} />
        <rect x="68" y="14" width="18" height="66" rx="5" fill="#B08A4E" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-lg font-extrabold tracking-wide", light ? "text-warmwhite" : "text-charcoal-900")}>
          SNC
        </span>
        <span className={cn("mt-0.5 text-[9px] font-semibold tracking-[0.22em]", light ? "text-concrete-300" : "text-concrete-500")}>
          NAVNATH CONSTRUCTIONS
        </span>
      </span>
    </Link>
  );
}
