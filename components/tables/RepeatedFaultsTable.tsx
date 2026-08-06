"use client";

interface Props {
  data: {
    register_number: string;
    category_code: string;
    fault_description: string;
    last_failed_date: Date | string;
  }[];
}

export default function RepeatedFaultsTable({ data }: Props) {
  return (
    <div className="rounded-2xl border-2 border-red-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-red-600">
        Critical: Repeated Faults
      </h2>
      <p className="mb-6 text-sm text-slate-500">
        Vehicles failing repeatedly for the same component
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50/50 text-slate-500">
            <tr>
              <th className="p-3 font-medium">Vehicle Reg</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Fault Description</th>
              <th className="p-3 font-medium">Last Failed</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-700">
            {data?.map((row, index) => (
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
                <td colSpan={4} className="p-4 text-center text-slate-500">
                  No repeated faults detected.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}