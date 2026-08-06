"use client";

import { RecentIncidentReview } from "@/types/dashboard";

import RiskBadge from "@/components/explorer/RiskBadge";
import StatusBadge from "@/components/explorer/StatusBadge";

import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";

interface Props {
  data: RecentIncidentReview[];
}

function formatDate(date: string) {

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(date));

}

export default function RecentIncidentTable({
  data,
}: Props) {
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = data.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  return (

    <div className="rounded-xl border bg-white shadow-sm">

      <div className="border-b px-6 py-4">

        <h2 className="text-lg font-semibold">

          Recent Incident Reviews

        </h2>

        <p className="text-sm text-slate-500">

          Latest safety events awaiting review or recently completed.

        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-4 py-3 text-left">
                Review ID
              </th>

              <th className="px-4 py-3 text-left">
                Driver
              </th>

              <th className="px-4 py-3 text-left">
                Event
              </th>

              <th className="px-4 py-3 text-left">
                Severity
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-left">
                Event Time
              </th>

            </tr>

          </thead>

          <tbody>

            {paginatedData.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="py-10 text-center text-slate-500"
                >

                  No recent incidents.

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

                  <div className="font-medium">

                    {review.full_name}

                  </div>

                  <div className="text-xs text-slate-500">

                    {review.driver_id}

                  </div>

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

                  {formatDate(
                    review.event_timestamp
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {data.length > pageSize && (
        <Pagination
          currentPage={safeCurrentPage}
          totalItems={data.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

    </div>

  );

}