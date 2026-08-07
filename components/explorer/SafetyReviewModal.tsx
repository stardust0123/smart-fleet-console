"use client";

import { useEffect, useState } from "react";

import { IncidentReview } from "@/types/safety";
import RiskBadge from "./RiskBadge";

interface Props {
  open: boolean;
  review: IncidentReview | null;

  onClose: () => void;

  onSaved: () => void;
}

export default function SafetyReviewModal({
  open,
  review,
  onClose,
  onSaved,
}: Props) {

  const [decision, setDecision] =
    useState("");

  const [comments, setComments] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    if (review) {

      setDecision(
        review.decision ?? ""
      );

      setComments(
        review.comments ?? ""
      );

    }

  }, [review]);

  if (!open || !review) return null;

  async function saveReview() {

    if (!decision) {

      alert("Please choose a decision.");

      return;

    }

    if (!review) {

      alert("Review not found.");

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(
        "/api/explorer/safety/review",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            reviewId:
              review.review_id,

            decision,

            comments,

          }),
        }
      );

      if (!response.ok) {

        throw new Error();

      }

      onSaved();

      onClose();

    } catch {

      alert(
        "Unable to save review."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-xl font-semibold">

            Incident Review

          </h2>

          <button
            onClick={onClose}
            className="text-gray-800 hover:text-black"
          >
            ✕
          </button>

        </div>

        <div className="space-y-6 p-6">

          <div className="grid grid-cols-2 gap-4">

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
              value={
                review.register_number
              }
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

              <p className="text-xs text-gray-800">

                Severity

              </p>

              <RiskBadge
                severity={
                  review.severity_code
                }
              />

            </div>

            <Info
              label="Occurred"
              value={new Date(
                review.event_timestamp
              ).toLocaleString()}
            />

          </div>

          <div>

            <label className="font-medium">

              Decision

            </label>

            <div className="mt-3 space-y-2">

              {[
                "Warning",

                "Coaching",

                "Retraining",

              ].map((item) => (

                <label
                  key={item}
                  className="flex items-center gap-2"
                >

                  <input
                    type="radio"
                    name="decision"
                    value={item}
                    checked={
                      decision === item
                    }
                    onChange={(e) =>
                      setDecision(
                        e.target.value
                      )
                    }
                  />

                  {item}

                </label>

              ))}

            </div>

          </div>

          <div>

            <label className="font-medium">

              Comments

            </label>

            <textarea
              rows={5}
              value={comments}
              onChange={(e) =>
                setComments(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-lg border p-3"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={saveReview}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
          >

            {loading
              ? "Saving..."
              : "Save Review"}

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

      <p className="text-xs text-gray-800">

        {label}

      </p>

      <p className="font-medium">

        {value}

      </p>

    </div>

  );

}