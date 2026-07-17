"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/shared/logo";
import { ProfileMenu } from "@/components/auth/profile-menu";
import { LinkButton } from "@/components/shared/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/founder", label: "Founder" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const light = isHome && !scrolled;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || !isHome ? "glass-nav-light py-3" : "bg-transparent py-6"
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between container-px">
        <Logo light={light} />

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-underline pb-1 text-sm font-medium tracking-wide transition-colors",
                light ? "text-warmwhite/90 hover:text-warmwhite" : "text-charcoal-800 hover:text-charcoal-950"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <ProfileMenu light={light} />
          <LinkButton href="/enquire" variant={light ? "secondary" : "gold"} className="!px-5 !py-2.5 !text-xs">
            Enquire Now
          </LinkButton>
        </div>

        <button
          className={cn("lg:hidden", light ? "text-warmwhite" : "text-charcoal-900")}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-warmwhite lg:hidden"
          >
            <div className="container-px flex flex-col gap-1 pb-6 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-base font-medium text-charcoal-900 transition hover:bg-charcoal-900/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center gap-3">
                <ProfileMenu />
                <LinkButton href="/enquire" variant="gold" className="flex-1 justify-center">
                  Enquire Now
                </LinkButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
