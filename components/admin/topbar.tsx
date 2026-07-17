"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ProfileMenu } from "@/components/auth/profile-menu";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/enquiries": "Enquiries",
  "/admin/projects": "Projects",
  "/admin/employees": "Employees",
  "/admin/media": "Media Library",
  "/admin/website": "Website Management",
  "/admin/activity": "Activity Log",
  "/admin/settings": "Settings",
};

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Admin";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-concrete-200 bg-warmwhite/90 px-5 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-charcoal-800 lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-semibold text-charcoal-900">{title}</h1>
      </div>
      <ProfileMenu />
    </header>
  );
}
