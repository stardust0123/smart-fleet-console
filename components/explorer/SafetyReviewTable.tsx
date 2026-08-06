"use client";

import { IncidentReview } from "@/types/safety";
import RiskBadge from "./RiskBadge";
import StatusBadge from "./StatusBadge";

interface Props {
  data: IncidentReview[];
  onReview: (review: IncidentReview) => void;
}

export default function SafetyReviewTable({
  data,
  onReview,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Review ID
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Driver
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Vehicle
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Depot
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Event
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Severity
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Decision
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Review Date
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="py-10 text-center text-slate-500"
                >
                  No incident reviews found.
                </td>
              </tr>
            )}

            {data.map((review) => (
              <tr
                key={review.review_id}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  {review.review_id}
                </td>

                <td className="px-4 py-3">
                  {review.full_name}
                </td>

                <td className="px-4 py-3">
                  {review.register_number}
                </td>

                <td className="px-4 py-3">
                  {review.depot_name}
                </td>

                <td className="px-4 py-3">
                  {review.event_name}
                </td>

                <td className="px-4 py-3">
                    <RiskBadge
                        severity={review.severity_code}
                    />
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={review.review_status} />
                </td>

                <td className="px-4 py-3">
                  {review.decision ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {review.review_date
                    ? new Date(
                        review.review_date
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onReview(review)}
                    className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {review.review_status === "Completed"
                      ? "View"
                      : review.review_status === "In Progress"
                      ? "Continue"
                      : "Review"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}