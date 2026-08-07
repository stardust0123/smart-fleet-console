"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";

interface Props {
  data: {
    register_number: string;
    category_code: string;
    fault_description: string;
    last_failed_date: Date | string;
  }[];
}

export default function RepeatedFaultsTable({ data }: Props) {
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
    <div className="rounded-2xl border-2 border-red-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-red-600">
        Critical: Repeated Faults
      </h2>
      <p className="mb-6 text-sm text-black">
        Vehicles failing repeatedly for the same component
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50/50 text-black">
            <tr>
              <th className="p-3 font-medium">Vehicle Reg</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Fault Description</th>
              <th className="p-3 font-medium">Last Failed</th>
            </tr>
          </thead>
          <tbody className="divide-y text-black">
            {paginatedData?.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="p-3 font-semibold">{row.register_number}</td>
                <td className="p-3">{row.category_code}</td>
                <td className="p-3 text-red-500 font-medium">{row.fault_description}</td>
                <td className="p-3">
                  {new Date(row.last_failed_date).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-black">
                  No repeated faults detected.
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