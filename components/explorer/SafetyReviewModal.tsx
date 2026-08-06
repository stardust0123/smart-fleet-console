"use client";

import { useState } from "react";
import { IncidentReview } from "@/types/safety";

interface Props {
  open: boolean;
  review: IncidentReview | null;
  onClose: () => void;
  onSave: (
    reviewId: string,
    decision: string,
    comments: string
  ) => Promise<void>;
}

export default function SafetyReviewModal({
  open,
  review,
  onClose,
  onSave,
}: Props) {
  const [decision, setDecision] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open || !review) return null;

  const currentReview = review;

  async function handleSave() {
    setLoading(true);

    await onSave(
      String(currentReview.review_id),
      decision,
      comments
    );

    setLoading(false);

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">

        <h2 className="text-2xl font-semibold">
          Review Safety Incident
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-slate-500">
              Review ID
            </label>

            <p className="font-medium">
              {review.review_id}
            </p>
          </div>

          <div>
            <label className="text-sm text-slate-500">
              Driver
            </label>

            <p>{review.full_name}</p>
          </div>

          <div>
            <label className="text-sm text-slate-500">
              Vehicle
            </label>

            <p>{review.register_number}</p>
          </div>

          <div>
            <label className="text-sm text-slate-500">
              Event
            </label>

            <p>{review.event_name}</p>
          </div>

          <div>
            <label className="text-sm text-slate-500">
              Severity
            </label>

            <p>{review.severity_code}</p>
          </div>

        </div>

        <div className="mt-6">

          <label className="block text-sm font-medium">
            Decision
          </label>

          <select
            className="mt-2 w-full rounded-lg border p-2"
            value={decision}
            onChange={(e) =>
              setDecision(e.target.value)
            }
          >
            <option value="">Select Decision</option>
            <option value="Warning">
              Warning
            </option>
            <option value="Coaching">
              Coaching
            </option>
            <option value="Retraining">
              Retraining
            </option>
          </select>

        </div>

        <div className="mt-4">

          <label className="block text-sm font-medium">
            Comments
          </label>

          <textarea
            rows={4}
            className="mt-2 w-full rounded-lg border p-2"
            value={comments}
            onChange={(e) =>
              setComments(e.target.value)
            }
          />

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            Save Review
          </button>

        </div>

      </div>

    </div>
  );
}

