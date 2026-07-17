"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { AdminSidebar } from "./sidebar";
import { AdminTopbar } from "./topbar";
import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  Building2,
  Users,
  Image as ImageIcon,
  Settings2,
  Activity,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/website", label: "Website Management", icon: Settings2 },
  { href: "/admin/activity", label: "Activity Log", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-warmwhite">
      <AdminSidebar />

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-charcoal-950/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-charcoal-950 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between px-6 py-7">
                <Logo light />
                <button onClick={() => setMobileOpen(false)} className="text-warmwhite" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 px-3">
                {NAV.map((item) => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                        active ? "bg-gold-500 text-charcoal-950" : "text-concrete-300 hover:bg-white/5 hover:text-warmwhite"
                      )}
                    >
                      <item.icon className="h-4 w-4" strokeWidth={1.9} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
