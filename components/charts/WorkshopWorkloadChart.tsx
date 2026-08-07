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
  const normalizedData = (data || []).map((item) => {
    const name = String(item.workshop_name || "")
      .replace(/workshop/i, "")
      .replace(/Workshop/i, "")
      .trim();

    if (name.toLowerCase().includes("ha noi") || name.toLowerCase().includes("hanoi")) {
      return { ...item, workshop_name: "Ha Noi" };
    }
    if (name.toLowerCase().includes("ho chi minh") || name.toLowerCase().includes("hcm")) {
      return { ...item, workshop_name: "Ho Chi Minh" };
    }
    if (name.toLowerCase().includes("da nang") || name.toLowerCase().includes("danang")) {
      return { ...item, workshop_name: "Da Nang" };
    }
    if (name.toLowerCase().includes("can tho") || name.toLowerCase().includes("cantho")) {
      return { ...item, workshop_name: "Can Tho" };
    }

    return { ...item, workshop_name: name || "Unknown" };
  });

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Workshop Workload
      </h2>

      <p className="mb-6 text-sm text-gray-800">
        Maintenance jobs by workshop
      </p>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={normalizedData}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="workshop_name" tick={{ fontSize: 12 }} />

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