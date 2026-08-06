"use client";

import SafetyScoreBadge from "./SafetyScoreBadge";

import { SafetyScore } from "@/types/safety";

interface Props {
  data: SafetyScore[];
}

export default function SafetyScoreTable({
  data,
}: Props) {

  return (

    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Driver ID
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Driver Name
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Depot
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Score Month
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Score
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Risk Level
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Comments
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Calculated At
              </th>

            </tr>

          </thead>

          <tbody>

            {data.length === 0 && (

              <tr>

                <td
                  colSpan={8}
                  className="py-8 text-center text-slate-500"
                >
                  No safety scores found.
                </td>

              </tr>

            )}

            {data.map((score) => (

              <tr
                key={score.score_id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-4 py-3 font-medium">
                  {score.driver_id}
                </td>

                <td className="px-4 py-3">
                  {score.full_name}
                </td>

                <td className="px-4 py-3">
                  {score.depot_name}
                </td>

                <td className="px-4 py-3">
                  {score.score_month}
                </td>

                <td className="px-4 py-3 text-center font-semibold">
                  {score.safety_score}
                </td>

                <td className="px-4 py-3 text-center">
                  <SafetyScoreBadge
                    score={score.safety_score}
                  />
                </td>

                <td className="px-4 py-3">
                  {score.comments ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {new Date(
                    score.calculated_at
                  ).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}