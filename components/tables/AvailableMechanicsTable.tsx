"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";

interface MechanicRow {
  mechanic_id: string;
  full_name: string;
  depot_name?: string | null;
}

interface Props {
  data: MechanicRow[];
}

export default function AvailableMechanicsTable({ data }: Props) {
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b bg-green-50/50 p-4">
        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <h3 className="font-semibold text-green-800">Available Mechanics (Idle)</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-900">
            <tr>
              <th className="px-4 py-3">Mechanic ID</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Depot Location</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((mech) => (
                <tr key={mech.mechanic_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-black">{mech.mechanic_id}</td>
                  <td className="px-4 py-3 text-black">{mech.full_name}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{mech.depot_name || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md border border-green-200 bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      Ready for Assignment
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-black">
                  All mechanics are currently busy.
                </td>
              </tr>
            )}
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
