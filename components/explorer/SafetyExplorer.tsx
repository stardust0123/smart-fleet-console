"use client";

import { useState } from "react";
import SafetyReviewModal from "./SafetyReviewModal";
import SafetyViewModal from "./SafetyViewModal";
import SafetyReviewFilters from "./SafetyReviewFilters";
import SafetyReviewTable from "./SafetyReviewTable";
import SafetyScoreFilters from "./SafetyScoreFilters";
import SafetyScoreTable from "./SafetyScoreTable";

import type {
  IncidentReview,
  SafetyIncidentFilters,
  SafetyScore,
  SafetyScoreFilters as SafetyScoreFilterType,
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

  const [scores, setScores] =
  useState(safetyScores);

const [loadingScores, setLoadingScores] =
  useState(false);

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

async function handleScoreSearch(
  filters: SafetyScoreFilterType
) {

  setLoadingScores(true);

  try {

    const response = await fetch(

      "/api/explorer/safety/safety-score",

      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          filters
        ),

      }

    );

    const data =
      await response.json();

    setScores(data);

  } catch (error) {

    console.error(error);

    alert(
      "Unable to load safety scores."
    );

  } finally {

    setLoadingScores(false);

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
              : "text-black"
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
              : "text-black"
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

            <p className="mt-2 text-sm text-black">
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

                <div className="rounded-lg border p-8 text-center text-black">

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

    <p className="mt-2 text-sm text-black">
      Monitor monthly driver safety
      performance and identify
      high-risk drivers.
    </p>

    <div className="mt-6">

      <SafetyScoreFilters

        drivers={drivers}

        depots={depots}

        onSearch={
          handleScoreSearch
        }

      />

    </div>

    <div className="mt-6">

      {loadingScores ? (

        <div className="rounded-lg border p-8 text-center text-black">

          Loading safety scores...

        </div>

      ) : (

        <SafetyScoreTable
          data={scores}
        />

      )}

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