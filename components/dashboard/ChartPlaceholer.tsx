import DashboardCard from "./DashboardCard";

interface ChartPlaceholderProps {
  title: string;
  subtitle?: string;
  height?: string;
}

export default function ChartPlaceholder({
  title,
  subtitle,
  height = "h-72",
}: ChartPlaceholderProps) {
  const bars = [
    45, 70, 55, 90, 65, 80, 60, 95, 75, 85, 55, 70,
  ];

  return (
    <DashboardCard>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-black">
              {subtitle}
            </p>
          )}
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-black">
          Demo
        </span>
      </div>

      <div
        className={`mt-8 flex items-end justify-between gap-3 ${height}`}
      >
        {bars.map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-xl bg-blue-500/80 transition-all duration-300 hover:bg-blue-600"
            style={{
              height: `${height}%`,
            }}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-between text-xs text-black">
        <span>Jan</span>
        <span>Mar</span>
        <span>May</span>
        <span>Jul</span>
        <span>Sep</span>
        <span>Nov</span>
      </div>
    </DashboardCard>
  );
}