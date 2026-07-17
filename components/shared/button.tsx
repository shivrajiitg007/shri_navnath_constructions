"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "gold";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-warmwhite text-charcoal-900 hover:bg-white shadow-premium hover:-translate-y-0.5",
  secondary:
    "bg-transparent text-warmwhite border border-warmwhite/30 hover:border-warmwhite/70 hover:-translate-y-0.5",
  ghost: "bg-transparent text-charcoal-900 hover:text-gold-600",
  gold: "bg-gold-500 text-charcoal-950 hover:bg-gold-400 shadow-premium hover:-translate-y-0.5",
};

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  icon?: boolean;
}

export function Button({
  variant = "primary",
  children,
  className,
  icon = false,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
      {icon && <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  children,
  className,
  icon = false,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], "group", className)}>
      {children}
      {icon && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
      )}
    </Link>
  );
}
