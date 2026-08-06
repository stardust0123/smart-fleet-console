export interface ManagerDashboardStats {
  totalVehicles: number;
  openJobs: number;
  predictiveAlerts: number;
  mechanicsAvailable: number;
  // Additional counters for summary cards
  lowStockParts: number;
  overdueVehicles: number;
  awaitingInspection: number;
}

// 1. Vehicles overdue for service
export interface OverdueVehicle {
  vehicle_id: string;
  register_number: string;
  model: string;
  odometer_km: number;
  status_code: string;
  last_maintenance_date: Date | string;
  days_since_last_maintenance: number;
}

// 2. Vehicles awaiting inspection
export interface AwaitingInspectionVehicle {
  vehicle_id: string;
  register_number: string;
  model: string;
  status_code: string;
}

// 3. Parts below reorder thresholds
export interface LowStockPart {
  part_name: string;
  quantity: number;
  re_order_threshold: number;
}

// 4. Supplier performance comparison
export interface SupplierPerformance {
  part_number_1: string;
  supplier_id_1: string;
  unit_price_1: number;
  supplier_id_2: string;
  unit_price_2: number;
  percentage_diff: number | string; 
}

/* =======================================================
   KPI CARDS
======================================================= */

export interface SafetyDashboardKPIs {

  pendingReviews: number;

  highRiskDrivers: number;

  retrainingRequired: number;

  criticalIncidents: number;

}

/* =======================================================
   RECENT INCIDENT REVIEW
======================================================= */

export interface RecentIncidentReview {

  review_id: number;

  driver_id: string;

  full_name: string;

  event_name: string;

  severity_code: string;

  event_timestamp: string;

  review_status: string;

}

/* =======================================================
   HIGH RISK DRIVER
======================================================= */

export interface HighRiskDriver {

  driver_id: string;

  full_name: string;

  depot_name: string;

  score_month: string;

  safety_score: number;

  comments: string | null;

}

/* =======================================================
   SAFETY TREND
======================================================= */

export interface SafetyTrend {

  depot_code: string;

  ACL: number;

  BRK: number;

  FTG: number;

  IDL: number;

  PHO: number;

  SB: number;

  SCN: number;

  SPD: number;

  total_events: number;

}

/* =======================================================
   RETRAINING QUEUE
======================================================= */

export interface RetrainingQueue {

  training_id: number;

  driver_id: string;

  full_name: string;

  training_type: string;

  start_date: string;

  end_date: string;

  training_status: string;

  outcome: string | null;

  training_source: string;

}


export interface SeverityDistribution {

  severity_code: string;

  total: number;

}