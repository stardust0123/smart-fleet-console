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
    alert_name: string;
    totalAlerts: number;
  }[];
}

export default function PredictiveAlertChart({
  data,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Predictive Alerts
      </h2>

      <p className="mb-6 text-sm text-gray-800">
        Alert distribution by type
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 12, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis dataKey="alert_name" type="category" width={140} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${value} alerts`, "Total"]} />
          <Bar dataKey="totalAlerts" fill="#2563eb" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}