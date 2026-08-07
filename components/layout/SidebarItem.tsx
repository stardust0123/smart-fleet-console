import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export default function SidebarItem({
  href,
  icon: Icon,
  label,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-900 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <Icon className="h-5 w-5" />

      <span>{label}</span>
    </Link>
  );
}