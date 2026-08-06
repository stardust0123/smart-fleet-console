import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface ProfileRow extends RowDataPacket {
  driver_id: string;
  full_name: string;
  email: string;
  phone: string;
  emergency_phone: string | null;
  depot_code: string;
  depot_name: string | null;
  status_name: string;
}

export async function getDriverProfile(driverId: string) {
  const [rows] = await pool.query<ProfileRow[]>(
    `
    SELECT
      d.driver_id, d.full_name, d.email, d.phone, d.emergency_phone,
      d.depot_code, dep.depot_name, ds.status_name
    FROM driver d
    LEFT JOIN driver_status ds ON d.status_code = ds.status_code
    LEFT JOIN depot dep ON d.depot_code = dep.depot_code
    WHERE d.driver_id = ?
    `,
    [driverId]
  );
  return rows;
}

interface ScoreRow extends RowDataPacket {
  score_id: number;
  score_month: string;
  safety_score: number;
  calculated_at: string;
}

export async function getDriverMonthlyScores(driverId: string) {
  const [rows] = await pool.query<ScoreRow[]>(
    `
    SELECT
      score_id,
      DATE_FORMAT(score_month, '%Y-%m-%d') AS score_month,
      safety_score,
      DATE_FORMAT(calculated_at, '%Y-%m-%d') AS calculated_at
    FROM safety_score
    WHERE driver_id = ?
    ORDER BY score_month ASC
    `,
    [driverId]
  );
  return rows;
}

interface CertificationRow extends RowDataPacket {
  credential_id: string;
  credential_name: string;
  credential_type: string;
  issue_date: string;
  expire_date: string;
}

export async function getDriverCertifications(driverId: string) {
  const [rows] = await pool.query<CertificationRow[]>(
    `
    SELECT
      dc.credential_id, dct.credential_name, dct.credential_type,
      dc.issue_date, dc.expire_date
    FROM drivers_credentials dc
    JOIN drive_credential_type dct ON dc.credential_code = dct.credential_code
    WHERE dc.driver_id = ?
    ORDER BY dc.expire_date ASC
    `,
    [driverId]
  );
  return rows;
}

interface AlertRow extends RowDataPacket {
  event_id: number;
  event_timestamp: string;
  event_code: string;
  event_name: string;
  severity_code: string;
  severity_name: string;
  review_status: string | null;
  decision: string | null;
  comments: string | null;
}

export async function getDriverAlerts(driverId: string) {
  const [rows] = await pool.query<AlertRow[]>(
    `
    SELECT
      sel.event_id, sel.event_timestamp, sel.event_code, set_l.event_name,
      sel.severity_code, sv.severity_name,
      er.review_status, er.decision, er.comments
    FROM safety_event_log sel
    JOIN safety_event_type set_l ON sel.event_code = set_l.event_code
    JOIN severity_level sv ON sel.severity_code = sv.severity_code
    LEFT JOIN event_review er ON sel.event_id = er.event_id
    WHERE sel.driver_id = ?
    ORDER BY sel.event_timestamp DESC
    LIMIT 20
    `,
    [driverId]
  );
  return rows;
}

interface TripRow extends RowDataPacket {
  assignment_id: number;
  driver_id: string;
  full_name: string;
  vehicle_id: string;
  register_number: string;
  assigned_from: string;
  assigned_to: string | null;
}

export async function getDriverTrips(driverId: string) {
  const [rows] = await pool.query<TripRow[]>(
    `
    SELECT
      va.assignment_id, va.driver_id, d.full_name,
      va.vehicle_id, v.register_number, va.assigned_from, va.assigned_to
    FROM vehicle_assignment va
    JOIN driver d ON va.driver_id = d.driver_id
    JOIN vehicle v ON va.vehicle_id = v.vehicle_id
    WHERE va.driver_id = ?
    ORDER BY va.assigned_from DESC
    LIMIT 50
    `,
    [driverId]
  );
  return rows;
}

interface CurrentVehicleRow extends RowDataPacket {
  vehicle_id: string;
  register_number: string;
  manufacturer: string;
  model: string;
  year_of_manufacture: number;
  odometer_km: number;
  assigned_from: string;
  assigned_to: string | null;
}

export async function getDriverCurrentVehicle(driverId: string) {
  const [rows] = await pool.query<CurrentVehicleRow[]>(
    `
    SELECT
      v.vehicle_id, v.register_number, v.manufacturer, v.model,
      v.year_of_manufacture, v.odometer_km,
      DATE_FORMAT(va.assigned_from, '%Y-%m-%d') AS assigned_from,
      DATE_FORMAT(va.assigned_to, '%Y-%m-%d') AS assigned_to
    FROM vehicle_assignment va
    JOIN vehicle v ON va.vehicle_id = v.vehicle_id
    WHERE va.driver_id = ? AND va.assigned_to IS NULL
    ORDER BY va.assigned_from DESC
    LIMIT 1
    `,
    [driverId]
  );
  return rows;
}

interface UpcomingMaintenanceRow extends RowDataPacket {
  job_id: string;
  vehicle_id: string;
  register_number: string;
  open_date: string;
  job_status: string;
  activity_name: string | null;
}

export async function getDriverUpcomingMaintenance(driverId: string) {
  const [rows] = await pool.query<UpcomingMaintenanceRow[]>(
    `
    SELECT
      mj.job_id, mj.vehicle_id, v.register_number,
      DATE_FORMAT(mj.open_date, '%Y-%m-%d') AS open_date,
      mj.job_status,
      GROUP_CONCAT(DISTINCT at_l.activity_name SEPARATOR ', ') AS activity_name
    FROM maintenance_job mj
    JOIN vehicle_assignment va ON mj.vehicle_id = va.vehicle_id
    JOIN vehicle v ON mj.vehicle_id = v.vehicle_id
    LEFT JOIN maintenance_activity ma ON mj.job_id = ma.job_id
    LEFT JOIN activity_type at_l ON ma.activity_code = at_l.activity_code
    WHERE va.driver_id = ? AND mj.job_status IN ('Pending', 'Inprogress')
    GROUP BY mj.job_id, mj.vehicle_id, v.register_number, mj.open_date, mj.job_status
    ORDER BY mj.open_date ASC
    LIMIT 10
    `,
    [driverId]
  );
  return rows;
}

interface CriticalAlertRow extends RowDataPacket {
  event_id: number;
  event_timestamp: string;
  event_name: string;
  severity_name: string;
  comments: string | null;
}

export async function getDriverCriticalAlerts(driverId: string) {
  const [rows] = await pool.query<CriticalAlertRow[]>(
    `
    SELECT
      sel.event_id,
      DATE_FORMAT(sel.event_timestamp, '%Y-%m-%d %H:%i') AS event_timestamp,
      set_l.event_name, sv.severity_name, er.comments
    FROM safety_event_log sel
    JOIN safety_event_type set_l ON sel.event_code = set_l.event_code
    JOIN severity_level sv ON sel.severity_code = sv.severity_code
    LEFT JOIN event_review er ON sel.event_id = er.event_id
    WHERE sel.driver_id = ?
      AND sel.severity_code IN ('CRIT', 'HIGH')
      AND (er.review_status IS NULL OR er.review_status != 'Completed')
    ORDER BY sel.event_timestamp DESC
    LIMIT 5
    `,
    [driverId]
  );
  return rows;
}

interface CoachingRow extends RowDataPacket {
  training_id: number;
  training_type: string;
  start_date: string;
  end_date: string;
  training_status: string;
  outcome: string;
  comments: string | null;
}

export async function getDriverCoachingHistory(driverId: string) {
  const [rows] = await pool.query<CoachingRow[]>(
    `
    SELECT
      cr.training_id, cr.training_type,
      DATE_FORMAT(cr.start_date, '%Y-%m-%d') AS start_date,
      DATE_FORMAT(cr.end_date, '%Y-%m-%d') AS end_date,
      cr.training_status, cr.outcome, cr.comments
    FROM coaching_retraining cr
    JOIN safety_score ss ON cr.score_id = ss.score_id
    WHERE ss.driver_id = ?
    ORDER BY cr.start_date DESC
    `,
    [driverId]
  );
  return rows;
}

interface MaintenanceRow extends RowDataPacket {
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
}

export async function getDriverMaintenanceHistory(driverId: string) {
  const [rows] = await pool.query<MaintenanceRow[]>(
    `
    SELECT
      mj.job_id, mj.vehicle_id, v.register_number, mj.workshop_id,
      DATE_FORMAT(mj.open_date, '%Y-%m-%d') AS open_date,
      DATE_FORMAT(mj.close_date, '%Y-%m-%d') AS close_date,
      mj.downtime_hours, mj.total_cost_vnd, mj.job_status,
      GROUP_CONCAT(DISTINCT at_l.activity_name SEPARATOR ', ') AS activity_name,
      GROUP_CONCAT(DISTINCT ma.diagnostic_result SEPARATOR '; ') AS diagnostic_result
    FROM maintenance_job mj
    JOIN vehicle_assignment va ON mj.vehicle_id = va.vehicle_id
    JOIN vehicle v ON mj.vehicle_id = v.vehicle_id
    LEFT JOIN maintenance_activity ma ON mj.job_id = ma.job_id
    LEFT JOIN activity_type at_l ON ma.activity_code = at_l.activity_code
    WHERE va.driver_id = ?
    GROUP BY mj.job_id, mj.vehicle_id, v.register_number, mj.workshop_id,
             mj.open_date, mj.close_date, mj.downtime_hours,
             mj.total_cost_vnd, mj.job_status
    ORDER BY mj.open_date DESC
    LIMIT 50
    `,
    [driverId]
  );
  return rows;
}

interface ViolationRow extends RowDataPacket {
  event_id: number;
  event_timestamp: string;
  event_code: string;
  event_name: string;
  severity_code: string;
  severity_name: string;
  review_status: string | null;
  decision: string | null;
  comments: string | null;
}

export async function getDriverViolations(driverId: string) {
  const [rows] = await pool.query<ViolationRow[]>(
    `
    SELECT
      sel.event_id,
      DATE_FORMAT(sel.event_timestamp, '%Y-%m-%d') AS event_timestamp,
      sel.event_code, set_l.event_name,
      sel.severity_code, sv.severity_name,
      er.review_status, er.decision, er.comments
    FROM safety_event_log sel
    JOIN safety_event_type set_l ON sel.event_code = set_l.event_code
    JOIN severity_level sv ON sel.severity_code = sv.severity_code
    LEFT JOIN event_review er ON sel.event_id = er.event_id
    WHERE sel.driver_id = ?
    ORDER BY sel.event_timestamp DESC
    LIMIT 50
    `,
    [driverId]
  );
  return rows;
}

