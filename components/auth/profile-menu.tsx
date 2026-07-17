"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "./auth-provider";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function ProfileMenu({ light = false }: { light?: boolean }) {
  const { user, isAdmin, openLogin } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) {
    return (
      <button
        onClick={openLogin}
        className={cn(
          "rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300",
          light
            ? "bg-warmwhite text-charcoal-900 hover:bg-white"
            : "bg-charcoal-900 text-warmwhite hover:bg-charcoal-800"
        )}
      >
        Login
      </button>
    );
  }

  const initial = user.email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium transition",
          light ? "bg-white/10 text-warmwhite hover:bg-white/20" : "bg-charcoal-900/5 text-charcoal-900 hover:bg-charcoal-900/10"
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-charcoal-950">
          {initial}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-charcoal-900/5 bg-white p-1.5 shadow-2xl"
          >
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-charcoal-900">{user.email}</p>
              <p className="text-xs text-concrete-500">{isAdmin ? "Administrator" : "Account"}</p>
            </div>
            <div className="h-px bg-charcoal-900/5" />
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-charcoal-800 transition hover:bg-warmwhite"
            >
              <User className="h-4 w-4 text-concrete-400" /> Profile
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-charcoal-800 transition hover:bg-warmwhite"
              >
                <LayoutDashboard className="h-4 w-4 text-concrete-400" /> Dashboard
              </Link>
            )}
            <div className="h-px bg-charcoal-900/5" />
            <button
              onClick={async () => {
                setOpen(false);
                await signOut();
                router.push("/");
                router.refresh();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
