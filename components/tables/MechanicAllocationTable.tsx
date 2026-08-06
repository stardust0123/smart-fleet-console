"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/common/Pagination";

interface Props {
  data: {
    mechanic_id: string;
    full_name: string;
    phone: string;
    active_certifications: string | null;
  }[];
}

export default function MechanicAllocationTable({ data }: Props) {
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
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Available Mechanics
      </h2>
      <p className="mb-6 text-sm text-slate-500">
        List of active mechanics and their current certifications
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Full Name</th>
              <th className="p-3 font-medium">Contact</th>
              <th className="p-3 font-medium">Active Certifications</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-700">
            {paginatedData?.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-500">{row.mechanic_id}</td>
                <td className="p-3 font-semibold">{row.full_name}</td>
                <td className="p-3">{row.phone}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {row.active_certifications ? (
                      row.active_certifications.split(',').map((cert, i) => (
                        <span key={i} className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          {cert.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">Standard</span>
                    )}
                  </div>
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