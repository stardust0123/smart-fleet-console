import { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}