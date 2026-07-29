import Logo from "./Logo";
import SidebarItem from "./SidebarItem";

import {
  LayoutDashboard,
  Search,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <Logo />

      <nav className="flex-1 space-y-2 px-4 py-6">
        <SidebarItem
          href="/owner"
          icon={LayoutDashboard}
          label="Dashboard"
        />

        <SidebarItem
          href="/owner/explorer"
          icon={Search}
          label="Explorer"
        />
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