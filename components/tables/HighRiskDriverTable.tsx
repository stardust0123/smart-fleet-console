"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";
import { HighRiskDriver } from "@/types/dashboard";

interface Props {
  data: HighRiskDriver[];
}

function getRiskLevel(score: number) {

  if (score >= 90) {
    return {
      text: "Excellent",
      color: "bg-green-100 text-green-700",
    };
  }

  if (score >= 75) {
    return {
      text: "Good",
      color: "bg-blue-100 text-blue-700",
    };
  }

  if (score >= 50) {
    return {
      text: "Warning",
      color: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    text: "High Risk",
    color: "bg-red-100 text-red-700",
  };

}

export default function HighRiskDriverTable({
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

            High Risk Drivers

          </h2>

          <p className="text-sm text-black">

            Drivers requiring attention based on latest safety score.

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
                Depot
              </th>

              <th className="px-4 py-3 text-left">
                Score Month
              </th>

              <th className="px-4 py-3 text-left">
                Safety Score
              </th>

              <th className="px-4 py-3 text-left">
                Risk Level
              </th>

            </tr>

          </thead>

          <tbody>

            {paginatedData.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="py-10 text-center text-black"
                >

                  No high-risk drivers.

                </td>

              </tr>

            )}

            {paginatedData.map((driver) => {

              const risk =
                getRiskLevel(driver.safety_score);

              return (

                <tr
                  key={driver.driver_id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-4 py-3">

                    <div className="font-medium">

                      {driver.full_name}

                    </div>

                    <div className="text-xs text-black">

                      {driver.driver_id}

                    </div>

                  </td>

                  <td className="px-4 py-3">

                    {driver.depot_name}

                  </td>

                  <td className="px-4 py-3">

                    {new Intl.DateTimeFormat(
                      "en-GB",
                      {
                        month: "short",
                        year: "numeric",
                      }
                    ).format(
                      new Date(driver.score_month)
                    )}

                  </td>

                  <td className="px-4 py-3 font-semibold">

                    {driver.safety_score}

                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">

                    <span
                      className={`inline-flex min-w-[110px] items-center justify-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap ${risk.color}`}
                    >

                      {risk.text}

                    </span>

                  </td>

                </tr>

              );

            })}

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