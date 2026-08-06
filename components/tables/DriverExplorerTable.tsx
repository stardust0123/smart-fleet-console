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
  return "bg-slate-100 text-slate-700";
}

export default function DriverExplorerTable({
  records,
}: {
  records: ExplorerDriver[];
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">Driver Records</h2>
        <p className="mt-1 text-sm text-slate-500">
          {records.length} drivers found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-6 py-4">Driver ID</th>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Depot</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((driver) => (
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
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}