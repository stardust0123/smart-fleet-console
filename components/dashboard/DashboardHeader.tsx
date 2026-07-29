interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export default function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="text-right">
        <p className="text-sm text-slate-400">
          Last updated
        </p>

        <p className="font-medium text-slate-700">
          Just now
        </p>
      </div>
    </div>
  );
}