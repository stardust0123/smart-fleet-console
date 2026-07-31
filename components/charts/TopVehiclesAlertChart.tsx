"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from "recharts";

interface Props {
  data: {
    register_number: string;
    totalAlerts: number;
  }[];
}

export default function TopVehiclesAlertChart({
  data,
}: Props) {
  const sorted = [...data].sort(
    (a, b) => b.totalAlerts - a.totalAlerts
  );

  const max = Math.max(...sorted.map((d) => d.totalAlerts));

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Top Vehicles with Alerts
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        Vehicles with the highest number of predictive alerts
      </p>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{
            top: 10,
            right: 35,
            left: 10,
            bottom: 10,
          }}
          barCategoryGap={18}
        >
          <CartesianGrid
            horizontal={false}
            stroke="#F1F5F9"
          />

          <XAxis
            type="number"
            domain={[0, max + 1]}
            allowDecimals={false}
            tickCount={max + 2}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            type="category"
            dataKey="register_number"
            width={95}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 14,
              fill: "#334155",
            }}
          />

          <Tooltip
            formatter={(value) => [
              `${value} alerts`,
              "Alerts",
            ]}
          />

          <Bar
            dataKey="totalAlerts"
            radius={[0, 10, 10, 0]}
            barSize={28}
          >
            {sorted.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.totalAlerts === max
                    ? "#DC2626"
                    : "#2563EB"
                }
              />
            ))}

            <LabelList
              dataKey="totalAlerts"
              position="right"
              style={{
                fill: "#111827",
                fontWeight: 700,
                fontSize: 14,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}