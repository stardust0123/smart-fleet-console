'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  data: { activity_name: string; total: number }[];
}

export default function MechanicDiagnosticChart({ data }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Diagnostics by Activity</h2>
      <p className="mb-4 text-sm text-black">
        Top activity types across logged diagnostic records (fleet-wide)
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="activity_name"
            width={140}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(value) => [`${value} records`, 'Total']} />
          <Bar dataKey="total" fill="#2563eb" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
