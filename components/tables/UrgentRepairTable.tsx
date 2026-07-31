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

export default function UrgentRepairTable({
  data,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Urgent Repair Queue
        </h2>

        <p className="text-sm text-slate-500">
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
            {data.map((repair) => (
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
                  {new Date(
                    repair.alert_timestamp
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}