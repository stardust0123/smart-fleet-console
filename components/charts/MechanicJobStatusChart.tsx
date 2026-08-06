'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

interface Props {
  data: { status: string; total: number }[];
}

const COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  InProgress: '#3b82f6',
  'In Progress': '#3b82f6',
  Completed: '#22c55e',
  Unknown: '#94a3b8',
};

export default function MechanicJobStatusChart({ data }: Props) {
  const hasData = data && data.length > 0;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">My Jobs by Status</h2>
      <p className="mb-4 text-sm text-slate-500">
        Jobs assigned to you, grouped by current status
      </p>

      {hasData ? (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              label={({ name, value }) => `${value}`}
              labelLine={false}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={COLORS[entry.status] ?? '#64748b'}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} jobs`, 'Total']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[16.25rem] items-center justify-center text-sm text-slate-400">
          No assigned jobs yet
        </div>
      )}
    </div>
  );
}
