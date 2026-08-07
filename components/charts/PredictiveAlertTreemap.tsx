"use client";

import {
  ResponsiveContainer,
  Tooltip,
  Treemap,
} from "recharts";

interface Props {
  data: {
    alert_name: string;
    totalAlerts: number;
  }[];
}

export default function PredictiveAlertTreemap({
  data,
}: Props) {
  const chartData = data.map((item) => ({
    name: item.alert_name,
    size: item.totalAlerts,
  }));

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Top 10 Predictive Alert Types
      </h2>

      <p className="mb-6 text-sm text-gray-800">
        Most common predictive maintenance alerts
      </p>

      <ResponsiveContainer
        width="100%"
        height={360}
      >
        <Treemap
          data={chartData}
          dataKey="size"
          stroke="#ffffff"
          fill="#2563eb"
        >
          <Tooltip
            formatter={(value) => [
              `${value} alerts`,
              "Occurrences",
            ]}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}