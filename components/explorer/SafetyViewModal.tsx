"use client";

import { IncidentReview } from "@/types/safety";
import RiskBadge from "./RiskBadge";
import StatusBadge from "./StatusBadge";

interface Props {
  open: boolean;

  review: IncidentReview | null;

  onClose: () => void;
}

export default function SafetyViewModal({
  open,
  review,
  onClose,
}: Props) {
  if (!open || !review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-xl font-semibold">
            Incident Details
          </h2>

          <button
            onClick={onClose}
            className="text-black transition hover:text-black"
          >
            ✕
          </button>

        </div>

        {/* Body */}

        <div className="space-y-6 p-6">

          <div className="grid grid-cols-2 gap-5">

            <Info
              label="Review ID"
              value={review.review_id}
            />

            <Info
              label="Driver"
              value={review.full_name}
            />

            <Info
              label="Vehicle"
              value={review.register_number}
            />

            <Info
              label="Depot"
              value={review.depot_name}
            />

            <Info
              label="Event"
              value={review.event_name}
            />

            <div>

              <p className="text-xs text-black">
                Severity
              </p>

              <RiskBadge
                severity={review.severity_code}
              />

            </div>

            <Info
              label="Occurred Time"
              value={new Date(
                review.event_timestamp
              ).toLocaleString()}
            />

            <div>

              <p className="text-xs text-black">
                Review Status
              </p>

              <StatusBadge
                status={review.review_status}
              />

            </div>

          </div>

          <hr />

          <div className="grid grid-cols-2 gap-5">

            <Info
              label="Decision"
              value={
                review.decision ?? "-"
              }
            />

            <Info
              label="Review Date"
              value={
                review.review_date
                  ? new Date(
                      review.review_date
                    ).toLocaleDateString()
                  : "-"
              }
            />

          </div>

          <div>

            <p className="text-sm font-medium">
              Comments
            </p>

            <div className="mt-2 rounded-lg border bg-slate-50 p-4 min-h-30">

              {review.comments ??
                "No comments."}

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end border-t px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-5 py-2 text-white transition hover:bg-slate-900"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>

      <p className="text-xs text-black">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>

    </div>
  );
}