"use client";

import Logo from "./Logo";
import SidebarItem from "./SidebarItem";

import {
  LayoutDashboard,
  Search,
  Settings,
  LogOut,
} from "lucide-react";

import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // Example:
  // /manager -> manager
  // /manager/explorer -> manager
  // /mechanic/explorer -> mechanic
  const role = pathname.split("/")[1];

  const menu = {
    manager: [
      {
        href: "/manager",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: "/manager/explorer",
        label: "Explorer",
        icon: Search,
      },
    ],

    mechanic: [
      {
        href: "/mechanic",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: "/mechanic/explorer",
        label: "Explorer",
        icon: Search,
      },
    ],

    safety: [
      {
        href: "/safety",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: "/safety/explorer",
        label: "Explorer",
        icon: Search,
      },
    ],

    driver: [
      {
        href: "/driver",
        label: "Dashboard",
        icon: LayoutDashboard,
      },

      // Remove this if Drivers shouldn't have Explorer
      {
        href: "/driver/explorer",
        label: "Explorer",
        icon: Search,
      },
    ],
  };

  const items =
    menu[role as keyof typeof menu] ?? [];

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <Logo />

      <nav className="flex-1 space-y-2 px-4 py-6">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      <div className="space-y-2 border-t p-4">
        <SidebarItem
          href="/settings"
          icon={Settings}
          label="Settings"
        />

        <SidebarItem
          href="/login"
          icon={LogOut}
          label="Logout"
        />
      </div>
    </aside>
  );
}