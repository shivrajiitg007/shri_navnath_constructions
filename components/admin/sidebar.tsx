"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Building2,
  Users,
  Image as ImageIcon,
  Settings2,
  Activity,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";

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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-charcoal-800 bg-charcoal-950 lg:flex">
      <div className="px-6 py-7">
        <Logo light />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
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
      <div className="border-t border-charcoal-800 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-concrete-400 transition hover:bg-white/5 hover:text-warmwhite"
        >
          <ExternalLink className="h-4 w-4" /> View live site
        </Link>
      </div>
    </aside>
  );
}
