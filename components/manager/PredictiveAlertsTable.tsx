"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Pagination from "@/components/common/Pagination";

interface AlertRow {
  timestamp?: string | Date | null;
  vehicle_id?: string;
  alert_type?: string;
  severity?: string;
  description?: string;
}

interface Props {
  data: AlertRow[];
}

export default function PredictiveAlertsTable({ data }: Props) {
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
          <AlertTriangle className="h-5 w-5 text-red-500" /> Component Health Alerts
        </h3>
        <span className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-600">
          {data?.length || 0} found
        </span>
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Vehicle ID</th>
              <th className="px-4 py-3 font-medium">Alert Type</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Following Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((a, idx) => (
                <tr key={`${a.vehicle_id || "vehicle"}-${idx}`} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    {a.timestamp ? new Date(a.timestamp).toLocaleString("vi-VN") : "N/A"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{a.vehicle_id}</td>
                  <td className="px-4 py-3 font-medium text-blue-700">{a.alert_type || "Unknown Code"}</td>
                  <td className="px-4 py-3 font-medium text-amber-600">{a.severity}</td>
                  <td className="px-4 py-3 text-gray-600">{a.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                  No alerts found matching your filters.
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
