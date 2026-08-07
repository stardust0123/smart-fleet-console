"use client";

type Trip = {
  assignment_id: number;
  driver_id: string;
  full_name: string;
  vehicle_id: string;
  register_number: string;
  assigned_from: string | Date;
  assigned_to: string | Date | null;
};

type Alert = {
  event_id: number;
  event_timestamp: string;
  event_code: string;
  event_name: string;
  severity_code: string;
  severity_name: string;
  review_status: string | null;
  decision: string | null;
  comments: string | null;
};

function formatDate(value: string | Date | null): string {
  if (!value) return "Current";
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleDateString("en-GB");
}

function severityBadgeClass(severityCode: string): string {
  switch (severityCode) {
    case "CRIT":
      return "bg-red-100 text-red-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    case "MED":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function DriverTripsTable({
  trips,
  alerts,
}: {
  trips: Trip[];
  alerts: Alert[];
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Vehicle Assignments
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-black">
                <th className="pb-2">Driver</th>
                <th className="pb-2">Vehicle</th>
                <th className="pb-2">Register No.</th>
                <th className="pb-2">From</th>
                <th className="pb-2">To</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t.assignment_id} className="border-t">
                  <td className="py-2">{t.full_name}</td>
                  <td className="py-2">{t.vehicle_id}</td>
                  <td className="py-2 font-medium">{t.register_number}</td>
                  <td className="py-2">{formatDate(t.assigned_from)}</td>
                  <td className="py-2">{formatDate(t.assigned_to)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Safety Alerts & Warnings
        </h2>
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-500">
            No safety alerts. Keep up the good driving!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-black">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Event</th>
                  <th className="pb-2">Severity</th>
                  <th className="pb-2">Review</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a) => (
                  <tr key={a.event_id} className="border-t align-top">
                    <td className="py-2 whitespace-nowrap">
                      {formatDate(a.event_timestamp)}
                    </td>
                    <td className="py-2">
                      <p className="font-medium text-slate-900">{a.event_name}</p>
                      <p className="text-xs text-slate-500">{a.event_code}</p>
                      {a.comments && (
                        <p className="mt-1 text-xs italic text-slate-500">
                          {a.comments}
                        </p>
                      )}
                    </td>
                    <td className="py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityBadgeClass(
                          a.severity_code
                        )}`}
                      >
                        {a.severity_name}
                      </span>
                    </td>
                    <td className="py-2">
                      {a.decision ? (
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                            a.decision === "Warning"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {a.decision}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {a.review_status ?? "Pending"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}