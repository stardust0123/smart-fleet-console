"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: {
    workshop_name: string;
    totalJobs: number;
  }[];
}

export default function WorkshopWorkloadChart({
  data,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Workshop Workload
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        Maintenance jobs by workshop
      </p>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="workshop_name" />

          <YAxis />

          <Tooltip
                formatter={(value) => [`${value} jobs`, "Workload"]}
                />

          <Bar
            dataKey="totalJobs"
            fill="#A3D8FF"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}