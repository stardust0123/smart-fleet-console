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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-black">
            {description}
          </p>
        )}
      </div>

      <div className="text-right">
        <p className="text-sm text-black">
          Last updated
        </p>

        <p className="font-medium text-black">
          Just now
        </p>
      </div>
    </div>
  );
}