"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";

type ExplorerDriver = {
  driver_id: string;
  full_name: string;
  email: string;
  phone: string;
  depot_code: string;
  status_name: string;
};

function statusBadgeClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("active")) return "bg-green-100 text-green-700";
  if (normalized.includes("inactive") || normalized.includes("suspend")) return "bg-red-100 text-red-700";
  if (normalized.includes("leave") || normalized.includes("off")) return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-black";
}

export default function DriverExplorerTable({
  records,
}: {
  records: ExplorerDriver[];
}) {
  const pageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [records]);

  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRecords = records.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">Driver Records</h2>
        <p className="mt-1 text-sm text-black">
          {records.length} drivers found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-900">
              <th className="px-6 py-4">Driver ID</th>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Depot</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((driver) => (
              <tr key={driver.driver_id} className="border-t hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{driver.driver_id}</td>
                <td className="px-6 py-4">{driver.full_name}</td>
                <td className="px-6 py-4">{driver.email}</td>
                <td className="px-6 py-4">{driver.phone}</td>
                <td className="px-6 py-4">{driver.depot_code}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(driver.status_name)}`}>
                    {driver.status_name}
                  </span>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr className="border-t">
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-black">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {records.length > pageSize && (
        <Pagination
          currentPage={safeCurrentPage}
          totalItems={records.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}