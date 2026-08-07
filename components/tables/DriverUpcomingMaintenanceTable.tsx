"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";

type UpcomingMaintenance = {
  job_id: string;
  vehicle_id: string;
  register_number: string;
  open_date: string;
  job_status: string;
  activity_name: string | null;
};

function formatDate(value: string): string {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB");
}

function statusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "inprogress":
      return "bg-blue-100 text-blue-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function DriverUpcomingMaintenanceTable({
  maintenance,
}: {
  maintenance: UpcomingMaintenance[];
}) {
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [maintenance]);

  const totalPages = Math.max(1, Math.ceil(maintenance.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedMaintenance = maintenance.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  if (maintenance.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Upcoming Maintenance
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-black">
              <th className="pb-2">Job</th>
              <th className="pb-2">Vehicle</th>
              <th className="pb-2">Register No.</th>
              <th className="pb-2">Activity</th>
              <th className="pb-2">Open Date</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMaintenance.map((m, idx) => (
              <tr key={`${m.job_id}-${idx}`} className="border-t">
                <td className="py-2 font-medium">{m.job_id}</td>
                <td className="py-2">{m.vehicle_id}</td>
                <td className="py-2 font-medium">{m.register_number}</td>
                <td className="py-2">{m.activity_name ?? "—"}</td>
                <td className="py-2">{formatDate(m.open_date)}</td>
                <td className="py-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(
                      m.job_status
                    )}`}
                  >
                    {m.job_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {maintenance.length > pageSize && (
        <Pagination
          currentPage={safeCurrentPage}
          totalItems={maintenance.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}