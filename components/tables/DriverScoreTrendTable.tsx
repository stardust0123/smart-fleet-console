"use client";

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

function formatMonth(value: string): string {
  const [y, m] = value.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function scoreBadgeClass(score: number): string {
  if (score >= 90) return "bg-green-100 text-green-700";
  if (score >= 80) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function DriverScoreTrendTable({
  monthlyScores,
}: {
  monthlyScores: MonthlyScore[];
}) {
  const rows = monthlyScores.map((s, i) => {
    const prev = i > 0 ? monthlyScores[i - 1].safety_score : null;
    const diff = prev !== null ? s.safety_score - prev : null;
    return { ...s, diff };
  });

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Compare Score Over Time
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-2">Month</th>
              <th className="pb-2">Score</th>
              <th className="pb-2">Change</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.score_id} className="border-t">
                <td className="py-2">{formatMonth(row.score_month)}</td>
                <td className="py-2">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBadgeClass(
                      row.safety_score
                    )}`}
                  >
                    {row.safety_score}
                  </span>
                </td>
                <td className="py-2">
                  {row.diff === null ? (
                    <span className="text-slate-400">—</span>
                  ) : row.diff > 0 ? (
                    <span className="font-medium text-green-600">▲ +{row.diff}</span>
                  ) : row.diff < 0 ? (
                    <span className="font-medium text-red-600">▼ {row.diff}</span>
                  ) : (
                    <span className="font-medium text-slate-500">— 0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}