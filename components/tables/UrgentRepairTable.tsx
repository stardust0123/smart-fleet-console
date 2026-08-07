"use client";
import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";

interface UrgentRepair {
  alert_id: string;
  register_number: string;
  alert_name: string;
  following_action: string;
  status_code: string;
  alert_timestamp: Date;
}

interface Props {
  data: UrgentRepair[];
}

function formatDate(value: Date | string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
}

export default function UrgentRepairTable({
  data,
}: Props) {
  const pageSize = 10;
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
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Urgent Repair Queue
        </h2>

        <p className="text-sm text-black">
          Vehicles requiring immediate workshop attention.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Alert ID</th>
              <th className="px-4 py-3 text-left">Vehicle</th>
              <th className="px-4 py-3 text-left">Alert Type</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Time</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((repair) => (
              <tr
                key={repair.alert_id}
                className="border-b hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium">
                  {repair.alert_id}
                </td>

                <td className="px-4 py-3">
                  {repair.register_number}
                </td>

                <td className="px-4 py-3">
                  {repair.alert_name}
                </td>

                <td className="px-4 py-3">
                  {repair.following_action}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                    {repair.status_code}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {formatDate(repair.alert_timestamp)}
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