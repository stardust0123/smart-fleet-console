import DashboardCard from "./DashboardCard";
import {
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  positive?: boolean;
}

export default function StatCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
}: StatCardProps) {
  return (
    <DashboardCard>
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-blue-50 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>

        {change && (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              positive
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}

            {change}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {value}
        </h2>

        <p className="mt-2 text-sm text-black">
          {title}
        </p>
      </div>
    </DashboardCard>
  );
}