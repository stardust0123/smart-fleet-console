"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface Props {
  data: {
    vehicle_model: string;
    avg_downtime_hours: number;
    avg_maintenance_cost: number;
  }[];
}

export default function ManagerCostChart({ data }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Maintenance Cost & Downtime
      </h2>
      <p className="mb-6 text-sm text-slate-500">
        Average cost vs downtime hours by vehicle model
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          
          <XAxis 
            dataKey="vehicle_model" 
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          
          {/* Left Y-Axis: Cost */}
          <YAxis 
            yAxisId="left"
            orientation="left"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            // FIX: Explicitly typed 'value' as 'number' to resolve TS errors
            tickFormatter={(value: number) => `${(value / 1000000).toFixed(1)}M`} 
          />

          {/* Right Y-Axis: Downtime */}
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "#f1f5f9" }}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            formatter={(value: any, name: any) => {
              const labelName = typeof name === "string" ? name : "Value";
              if (labelName === "Cost") return [`${Number(value).toLocaleString()} VND`, "Avg Cost"];
              return [`${Number(value).toFixed(1)} hrs`, "Avg Downtime"];
            }}
          />
          
          <Legend wrapperStyle={{ paddingTop: "20px" }} />

          {/* Cost Bar */}
          <Bar
            yAxisId="left"
            dataKey="avg_maintenance_cost"
            name="Cost"
            fill="#2563eb" 
            radius={[4, 4, 0, 0]}
            barSize={32}
          />
          
          {/* Downtime Bar */}
          <Bar
            yAxisId="right"
            dataKey="avg_downtime_hours"
            name="Downtime"
            fill="#93c5fd" 
            radius={[4, 4, 0, 0]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}