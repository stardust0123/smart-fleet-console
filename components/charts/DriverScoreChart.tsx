"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type MonthlyScore = {
  score_id: number;
  score_month: string;
  safety_score: number;
  calculated_at: string;
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function fillYear(year: string, rows: MonthlyScore[]): { month: string; score: number | null }[] {
  const byMonth = new Map(rows.map((r) => [r.score_month.slice(0, 7), r.safety_score]));
  return Array.from({ length: 12 }, (_, i) => {
    const key = `${year}-${pad(i + 1)}`;
    return {
      month: key,
      score: byMonth.get(key) ?? null,
    };
  });
}

export default function DriverScoreChart({
  monthlyScores,
}: {
  monthlyScores: MonthlyScore[];
}) {
  const years = [...new Set(monthlyScores.map((s) => s.score_month.slice(0, 4)))].sort();
  const latestYear = years[years.length - 1] ?? new Date().getFullYear().toString();
  const data = fillYear(latestYear, monthlyScores);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Monthly Safety Score</h2>
        <p className="mt-1 text-sm text-black">
          {latestYear} monthly safety score
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={(value) => MONTH_NAMES[Number(value.slice(5, 7)) - 1]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <Tooltip
            labelFormatter={(label) => MONTH_NAMES[Number(String(label).slice(5, 7)) - 1]}
            formatter={(value) => [
              value === null || value === undefined ? "N/A" : Number(value).toFixed(1),
              "Safety Score",
            ]}
          />
          <Bar dataKey="score" fill="#93c5fd" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}