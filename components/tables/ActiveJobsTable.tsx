"use client";

import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import Pagination from "@/components/common/Pagination";

interface JobRow {
  job_id: string;
  vehicle_id: string;
  open_date: string;
  job_status: string;
  register_number: string;
  model: string;
  depot_name?: string | null;
  activity_id?: string | null;
  assigned_mechanic_id?: string | null;
}

interface Props {
  data: JobRow[];
  allMechanics: { mechanic_id: string; full_name: string }[];
  onSubmit: (formData: FormData) => void;
}

export default function ActiveJobsTable({ data, allMechanics, onSubmit }: Props) {
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
    <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b bg-gray-50 p-4">
        <Wrench className="h-5 w-5 text-black" />
        <h3 className="font-semibold text-black">Active Maintenance Jobs & Allocation</h3>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-900">
            <tr>
              <th className="px-4 py-3">Job ID</th>
              <th className="px-4 py-3">Vehicle & Model</th>
              <th className="px-4 py-3">Vehicle Depot</th>
              <th className="px-4 py-3">Open Date</th>
              <th className="px-4 py-3">Current Status</th>
              <th className="px-4 py-3 text-right">Assign & Update Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((job) => (
                <tr key={job.job_id} className="border-b transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-black">{job.job_id}</td>
                  <td className="px-4 py-3 text-black">
                    <span className="font-semibold">{job.register_number}</span>
                    <span className="ml-1 block text-xs text-black">{job.model || "Unknown Model"}</span>
                  </td>
                  <td className="px-4 py-3 text-black">
                    <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                      {job.depot_name || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{new Date(job.open_date).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-medium ${
                        job.job_status === "OPEN" || job.job_status === "Pending"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : job.job_status === "IN_PROGRESS" || job.job_status === "In Progress"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-gray-200 bg-gray-100 text-black"
                      }`}
                    >
                      {job.job_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={onSubmit} className="flex items-center justify-end gap-2">
                      <input type="hidden" name="job_id" value={job.job_id} />
                      <input type="hidden" name="activity_id" value={job.activity_id || ""} />
                      <select
                        name="mechanic_id"
                        defaultValue={job.assigned_mechanic_id || ""}
                        className="w-36 rounded-md border border-gray-300 bg-white p-1.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">-- Unassigned --</option>
                        {allMechanics?.map((mech) => (
                          <option key={mech.mechanic_id} value={mech.mechanic_id}>
                            {mech.full_name}
                          </option>
                        ))}
                      </select>
                      <select
                        name="status"
                        defaultValue={job.job_status}
                        className="w-32 rounded-md border border-gray-300 bg-white p-1.5 text-xs text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-black">
                  No active maintenance jobs found.
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
