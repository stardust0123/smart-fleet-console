"use client";

import { useState } from "react";
import SafetyReviewModal from "./SafetyReviewModal";
import SafetyViewModal from "./SafetyViewModal";
import SafetyReviewFilters from "./SafetyReviewFilters";
import SafetyReviewTable from "./SafetyReviewTable";

import {
  IncidentReview,
  SafetyIncidentFilters,
  SafetyScore,
  DriverOption,
  DepotOption,
  EventOption,
} from "@/types/safety";

interface Props {
  incidentReviews: IncidentReview[];

  safetyScores: SafetyScore[];

  drivers: DriverOption[];

  depots: DepotOption[];

  events: EventOption[];
}



export default function SafetyExplorer({
  incidentReviews,
  safetyScores,

  drivers,
  depots,
  events,
}: Props) {

  const [activeTab, setActiveTab] =
    useState<"review" | "score">("review");

  const [reviews, setReviews] =
    useState(incidentReviews);

  const [loading, setLoading] =
    useState(false);
const [currentFilters, setCurrentFilters] =
  useState<SafetyIncidentFilters>({});

const [selectedReview, setSelectedReview] =
  useState<IncidentReview | null>(null);

const [openReviewModal, setOpenReviewModal] =
  useState(false);

const [openViewModal, setOpenViewModal] =
  useState(false);


function handleAction(
  review: IncidentReview
) {
  setSelectedReview(review);

  if (
    review.review_status ===
    "Completed"
  ) {
    setOpenViewModal(true);
  } else {
    setOpenReviewModal(true);
  }
}

  async function handleSearch(
  filters: SafetyIncidentFilters
) {
  setCurrentFilters(filters);

  setLoading(true);

  try {
    const response = await fetch(
      "/api/explorer/safety/search",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(filters),
      }
    );

    const data =
      await response.json();

    setReviews(data);

  } catch (error) {

    console.error(error);

    alert("Search failed.");

  } finally {

    setLoading(false);

  }
}

async function reloadReviews() {
  await handleSearch(currentFilters);
}

  return (

    <div className="rounded-2xl border bg-white shadow-sm">

      {/* Tabs */}

      <div className="flex border-b">

        <button
          onClick={() =>
            setActiveTab("review")
          }
          className={`px-6 py-4 text-sm font-medium transition ${
            activeTab === "review"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-500"
          }`}
        >
          Incident Review
        </button>

        <button
          onClick={() =>
            setActiveTab("score")
          }
          className={`px-6 py-4 text-sm font-medium transition ${
            activeTab === "score"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-500"
          }`}
        >
          Safety Score
        </button>

      </div>

      {/* Content */}

      <div className="p-6">

        {activeTab === "review" && (

          <>

            <h2 className="text-xl font-semibold">
              Incident Reviews
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Review safety incidents,
              investigate drivers,
              and complete event reviews.
            </p>

            <div className="mt-6">

              <SafetyReviewFilters
              drivers={drivers}
                depots={depots}
                events={events}
                onSearch={handleSearch}
              />

            </div>

            <div className="mt-6">

              {loading ? (

                <div className="rounded-lg border p-8 text-center text-slate-500">

                  Searching...

                </div>

              ) : (

                <SafetyReviewTable
                  data={reviews}
                  onReview={handleAction}

                />

              )}

            </div>

          </>

        )}

        {activeTab === "score" && (

          <>

            <h2 className="text-xl font-semibold">
              Safety Scores
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Monitor monthly driver safety
              performance.
            </p>

            <div className="mt-6 rounded-lg border border-dashed p-10 text-center text-slate-400">

              Safety Score

              <br />

              Total Records:

              {" "}

              {safetyScores.length}

            </div>

          </>

        )}

      </div>
      <>

        <SafetyReviewModal
          open={openReviewModal}
          review={selectedReview}
          onClose={() =>
            setOpenReviewModal(false)
          }
          onSaved={reloadReviews}
        />

        <SafetyViewModal
          open={openViewModal}
          review={selectedReview}
          onClose={() =>
            setOpenViewModal(false)
          }
        />

</>

    </div>
    

  );

}