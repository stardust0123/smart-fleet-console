import { ReactNode } from "react";

interface DashboardGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export default function DashboardGrid({
  children,
  cols = 4,
}: DashboardGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 xl:grid-cols-2",
    3: "grid-cols-1 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
  };

  return (
    <div
      className={`mb-6 grid gap-6 ${gridCols[cols]}`}
    >
      {children}
    </div>
  );
}
