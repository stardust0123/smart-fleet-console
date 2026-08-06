"use client";

import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import Pagination from "@/components/common/Pagination";

interface HistoryRow {
  job_id?: string;
  vehicle_id?: string;
  mechanics_assigned?: string;
  start_date?: string | Date | null;
  job_status?: string;
  total_cost_vnd?: number;
}

interface Props {
  data: HistoryRow[];
}

export default function MaintenanceHistoryTable({ data }: Props) {
  const PAGE_SIZE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = data.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b bg-gray-50 p-4">
        <h3 className="flex items-center gap-2 font-semibold text-gray-800">
          <Wrench className="h-5 w-5 text-blue-500" /> Maintenance History Records
        </h3>
        <span className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-600">
          {data?.length || 0} found
        </span>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Job ID</th>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Assigned Mechanics</th>
              <th className="px-4 py-3 font-medium">Open Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Cost (VND)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((h, idx) => (
                <tr key={`${h.job_id || "job"}-${idx}`} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{h.job_id}</td>
                  <td className="px-4 py-3 text-gray-700">{h.vehicle_id}</td>
                  <td className="px-4 py-3 font-medium text-blue-700">{h.mechanics_assigned || "Unassigned"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {h.start_date ? new Date(h.start_date).toLocaleDateString("vi-VN") : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-medium ${
                        h.job_status === "CLOSED" || h.job_status === "COMPLETED" || h.job_status === "Completed"
                          ? "border-gray-200 bg-gray-100 text-gray-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {h.job_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-700">
                    {h.total_cost_vnd
                      ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(h.total_cost_vnd)
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  No history records found matching your filters.
                </td>
              </tr>
            )}
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
