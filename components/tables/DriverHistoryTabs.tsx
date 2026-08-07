"use client";

import { useMemo, useState } from "react";

type Trip = {
  assignment_id: number;
  driver_id: string;
  full_name: string;
  vehicle_id: string;
  register_number: string;
  assigned_from: string | Date;
  assigned_to: string | Date | null;
};

type Maintenance = {
  job_id: string;
  vehicle_id: string;
  register_number: string;
  workshop_id: string;
  open_date: string;
  close_date: string | null;
  downtime_hours: number;
  total_cost_vnd: number;
  job_status: string;
  activity_name: string | null;
  diagnostic_result: string | null;
};

type Violation = {
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

type Coaching = {
  training_id: number;
  training_type: string;
  start_date: string;
  end_date: string;
  training_status: string;
  outcome: string;
  comments: string | null;
};

type Tab = "assignments" | "maintenance" | "violations" | "coaching";

const TABS: { key: Tab; label: string }[] = [
  { key: "assignments", label: "Assignments" },
  { key: "maintenance", label: "Maintenance History" },
  { key: "violations", label: "Violations" },
  { key: "coaching", label: "Coaching / Retraining" },
];

function formatDate(value: string | Date | null): string {
  if (!value) return "Current";
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleDateString("en-GB");
}

function formatVnd(value: number): string {
  return value.toLocaleString("vi-VN") + " VND";
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

function statusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "inprogress":
      return "bg-blue-100 text-blue-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function DriverHistoryTabs({
  trips,
  maintenance,
  violations,
  coaching,
}: {
  trips: Trip[];
  maintenance: Maintenance[];
  violations: Violation[];
  coaching: Coaching[];
}) {
  const [tab, setTab] = useState<Tab>("assignments");
  const [query, setQuery] = useState("");

  const filteredTrips = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return trips;
    return trips.filter(
      (t) =>
        t.vehicle_id.toLowerCase().includes(q) ||
        t.full_name.toLowerCase().includes(q)
    );
  }, [trips, query]);

  const filteredMaintenance = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return maintenance;
    return maintenance.filter(
      (m) =>
        m.vehicle_id.toLowerCase().includes(q) ||
        m.job_id.toLowerCase().includes(q) ||
        m.job_status.toLowerCase().includes(q) ||
        (m.activity_name ?? "").toLowerCase().includes(q)
    );
  }, [maintenance, query]);

  const filteredViolations = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return violations;
    return violations.filter(
      (v) =>
        v.event_name.toLowerCase().includes(q) ||
        v.severity_name.toLowerCase().includes(q) ||
        (v.decision ?? "").toLowerCase().includes(q)
    );
  }, [violations, query]);

  const filteredCoaching = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return coaching;
    return coaching.filter(
      (c) =>
        c.training_type.toLowerCase().includes(q) ||
        c.training_status.toLowerCase().includes(q) ||
        c.outcome.toLowerCase().includes(q)
    );
  }, [coaching, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl border border-slate-200 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                tab === t.key
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-64 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {tab === "assignments" && (
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
                {filteredTrips.map((t) => (
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
      )}

      {tab === "maintenance" && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Maintenance History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-black">
                  <th className="pb-2">Job</th>
                  <th className="pb-2">Vehicle</th>
                  <th className="pb-2">Register No.</th>
                  <th className="pb-2">Activity</th>
                  <th className="pb-2">Open</th>
                  <th className="pb-2">Close</th>
                  <th className="pb-2">Downtime</th>
                  <th className="pb-2">Cost</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaintenance.map((m, idx) => (
                  <tr key={`${m.job_id}-${idx}`} className="border-t align-top">
                    <td className="py-2 font-medium">{m.job_id}</td>
                    <td className="py-2">{m.vehicle_id}</td>
                    <td className="py-2 font-medium">{m.register_number}</td>
                    <td className="py-2">
                      <p>{m.activity_name ?? "—"}</p>
                      {m.diagnostic_result && (
                        <p className="mt-1 text-xs italic text-slate-500">
                          {m.diagnostic_result}
                        </p>
                      )}
                    </td>
                    <td className="py-2 whitespace-nowrap">{formatDate(m.open_date)}</td>
                    <td className="py-2 whitespace-nowrap">{formatDate(m.close_date)}</td>
                    <td className="py-2">{m.downtime_hours}h</td>
                    <td className="py-2 whitespace-nowrap">{formatVnd(m.total_cost_vnd)}</td>
                    <td className="py-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(
                          m.job_status
                        )}`}
                      >
                        {m.job_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "coaching" && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Coaching / Retraining History
          </h2>
          {filteredCoaching.length === 0 ? (
            <p className="text-sm text-slate-500">
              No coaching or retraining records.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-black">
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Start</th>
                    <th className="pb-2">End</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Outcome</th>
                    <th className="pb-2">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoaching.map((c) => (
                    <tr key={c.training_id} className="border-t align-top">
                      <td className="py-2 font-medium text-slate-900">
                        {c.training_type}
                      </td>
                      <td className="py-2 whitespace-nowrap">{formatDate(c.start_date)}</td>
                      <td className="py-2 whitespace-nowrap">{formatDate(c.end_date)}</td>
                      <td className="py-2">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(
                            c.training_status
                          )}`}
                        >
                          {c.training_status}
                        </span>
                      </td>
                      <td className="py-2">{c.outcome}</td>
                      <td className="py-2">
                        {c.comments ? (
                          <span className="text-xs italic text-slate-500">
                            {c.comments}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "violations" && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Violations History
          </h2>
          {filteredViolations.length === 0 ? (
            <p className="text-sm text-slate-500">
              No violations. Keep up the good driving!
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
                  {filteredViolations.map((v) => (
                    <tr key={v.event_id} className="border-t align-top">
                      <td className="py-2 whitespace-nowrap">
                        {formatDate(v.event_timestamp)}
                      </td>
                      <td className="py-2">
                        <p className="font-medium text-slate-900">{v.event_name}</p>
                        <p className="text-xs text-slate-500">{v.event_code}</p>
                        {v.comments && (
                          <p className="mt-1 text-xs italic text-slate-500">
                            {v.comments}
                          </p>
                        )}
                      </td>
                      <td className="py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityBadgeClass(
                            v.severity_code
                          )}`}
                        >
                          {v.severity_name}
                        </span>
                      </td>
                      <td className="py-2">
                        {v.decision ? (
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                              v.decision === "Warning"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {v.decision}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {v.review_status ?? "Pending"}
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
      )}
    </div>
  );
}