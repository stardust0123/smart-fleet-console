"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";
import { RetrainingQueue } from "@/types/dashboard";

interface Props {
  data: RetrainingQueue[];
}

function formatDate(date: string | null) {

  if (!date) return "-";

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(new Date(date));

}

function StatusBadge({
  status,
}: {
  status: string;
}) {

  let color =
    "bg-slate-100 text-slate-700";

  if (status === "Scheduled") {

    color =
      "bg-blue-100 text-blue-700";

  }

  if (status === "In Progress") {

    color =
      "bg-yellow-100 text-yellow-700";

  }

  if (status === "Completed") {

    color =
      "bg-green-100 text-green-700";

  }

  return (

    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${color}`}
    >
      {status}
    </span>

  );

}

export default function RetrainingQueueTable({
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

      <div className="flex items-center justify-between border-b px-6 py-4">

        <div>

          <h2 className="text-lg font-semibold">

            Retraining Queue

          </h2>

          <p className="text-sm text-slate-500">

            Drivers currently assigned to coaching or retraining.

          </p>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-4 py-3 text-left">
                Driver
              </th>

              <th className="px-4 py-3 text-left">
                Training Type
              </th>

              <th className="px-4 py-3 text-left">
                Start Date
              </th>

              <th className="px-4 py-3 text-left">
                End Date
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-left">
                Source
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

                  No retraining records.

                </td>

              </tr>

            )}

            {paginatedData.map((training) => (

              <tr
                key={training.training_id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-4 py-3">

                  <div className="font-medium">

                    {training.full_name}

                  </div>

                  <div className="text-xs text-slate-500">

                    {training.driver_id}

                  </div>

                </td>

                <td className="px-4 py-3">

                  {training.training_type}

                </td>

                <td className="px-4 py-3">

                  {formatDate(
                    training.start_date
                  )}

                </td>

                <td className="px-4 py-3">

                  {formatDate(
                    training.end_date
                  )}

                </td>

                <td className="px-4 py-3">

                  <StatusBadge
                    status={
                      training.training_status
                    }
                  />

                </td>

                <td className="px-4 py-3">

                  {training.training_source}

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