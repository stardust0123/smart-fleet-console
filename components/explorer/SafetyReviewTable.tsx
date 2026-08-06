"use client";

import { useEffect, useState } from "react";

import Pagination from "@/components/common/Pagination";

import { IncidentReview } from "@/types/safety";
import RiskBadge from "./RiskBadge";
import StatusBadge from "./StatusBadge";

interface Props {
  data: IncidentReview[];
  onReview: (review: IncidentReview) => void;
}

const PAGE_SIZE = 20;

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export default function SafetyReviewTable({
  data,
  onReview,
}: Props) {

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.max(
    1,
    Math.ceil(data.length / PAGE_SIZE)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedData = data.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

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

            {paginatedData.length === 0 && (

              <tr>

                <td
                  colSpan={10}
                  className="py-10 text-center text-slate-500"
                >
                  No incident reviews found.
                </td>

              </tr>

            )}

            {paginatedData.map((review) => (

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
                  <StatusBadge
                    status={review.review_status}
                  />
                </td>

                <td className="px-4 py-3">
                  {review.decision ?? "-"}
                </td>

                <td className="px-4 py-3">
                  {formatDate(review.review_date)}
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

      {data.length > PAGE_SIZE && (

        <Pagination
          currentPage={safeCurrentPage}
          totalItems={data.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />

      )}

    </div>
  );
}