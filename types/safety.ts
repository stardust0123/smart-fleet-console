/* =======================================================
   INCIDENT REVIEW
======================================================= */

export interface IncidentReview {
  review_id: number;

  event_id: string;

  driver_id: string;
  full_name: string;

  vehicle_id: string;
  register_number: string;

  depot_code: string;
  depot_name: string;

  event_code: string;
  event_name: string;

  severity_code: string;

  event_timestamp: string;

  review_status:
    | "Pending"
    | "In Progress"
    | "Completed";

  review_date: string | null;

  decision: string | null;

  comments: string | null;
}

/* =======================================================
   SAFETY SCORE
======================================================= */

export interface SafetyScore {
  score_id: number;

  driver_id: string;
  full_name: string;

  depot_name: string;

  score_month: string;

  safety_score: number;

  calculated_at: string;

  comments: string | null;
}

/* =======================================================
   DROPDOWN OPTIONS
======================================================= */

export interface DriverOption {
  driver_id: string;
  full_name: string;
}

export interface DepotOption {
  depot_code: string;
  depot_name: string;
}

export interface EventOption {
  event_code: string;
  event_name: string;
}

/* =======================================================
   INCIDENT FILTERS
======================================================= */

export interface SafetyIncidentFilters {
  driverId?: string;

  vehicleId?: string;

  depotCode?: string;

  eventCode?: string;

  severityCode?: string;

  reviewStatus?: string;

  startDate?: string;

  endDate?: string;
}

/* =======================================================
   SAFETY SCORE FILTERS
======================================================= */

export interface SafetyScoreFilters {
  driverId?: string;

  depotCode?: string;

  scoreMonth?: string;

  riskLevel?: string;

  minimumScore?: number;

  maximumScore?: number;
}
