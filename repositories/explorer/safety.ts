import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

import {
  IncidentReview,
  SafetyScore,
  DriverOption,
  DepotOption,
  EventOption,
  SafetyIncidentFilters,
} from "@/types/safety";

/* =======================================================
   INCIDENT REVIEWS
======================================================= */

export async function getIncidentReviews() {

  const [rows] =
    await pool.query<(IncidentReview & RowDataPacket)[]>(`
      SELECT

        er.review_id,

        sel.event_id,

        d.driver_id,
        d.full_name,

        v.vehicle_id,
        v.register_number,

        dp.depot_code,
        dp.depot_name,

        st.event_code,
        st.event_name,

        sel.severity_code,

        sel.event_timestamp,

        er.review_status,
        er.review_date,

        er.decision,
        er.comments

      FROM event_review er

      INNER JOIN safety_event_log sel
        ON er.event_id = sel.event_id

      INNER JOIN driver d
        ON sel.driver_id = d.driver_id

      INNER JOIN vehicle v
        ON sel.vehicle_id = v.vehicle_id

      INNER JOIN depot dp
        ON sel.depot_code = dp.depot_code

      INNER JOIN safety_event_type st
        ON sel.event_code = st.event_code

      ORDER BY
        sel.event_timestamp DESC
    `);

  return rows;
}

/* =======================================================
   SAFETY SCORE
======================================================= */

export async function getHighRiskDriversByMonth(
  month: string
) {

  const [rows] =
    await pool.query<(SafetyScore & RowDataPacket)[]>(
      `
      SELECT

        ss.score_id,

        d.driver_id,
        d.full_name,

        ss.score_month,

        ss.safety_score,

        ss.calculated_at,

        ss.comments

      FROM safety_score ss

      INNER JOIN driver d
        ON ss.driver_id = d.driver_id

      WHERE
        DATE_FORMAT(ss.score_month,'%Y-%m') = ?

      ORDER BY
        ss.safety_score ASC,
        d.driver_id
      `,
      [month]
    );

  return rows;
}

/* =======================================================
   FILTER DROPDOWNS
======================================================= */

export async function getDrivers() {

  const [rows] =
    await pool.query<(DriverOption & RowDataPacket)[]>(`
      SELECT
        driver_id,
        full_name
      FROM driver
      ORDER BY full_name
    `);

  return rows;

}

export async function getDepots() {

  const [rows] =
    await pool.query<(DepotOption & RowDataPacket)[]>(`
      SELECT

        depot_code,

        depot_name

      FROM depot

      ORDER BY depot_name
    `);

  return rows;
}

export async function getSafetyEvents() {

  const [rows] =
    await pool.query<(EventOption & RowDataPacket)[]>(`
      SELECT

        event_code,

        event_name

      FROM safety_event_type

      ORDER BY event_name
    `);

  return rows;
}

/* =======================================================
   SEARCH INCIDENTS
======================================================= */

export async function searchSafetyIncidents(
  filters: SafetyIncidentFilters
) {

  let sql = `
    SELECT

      er.review_id,

      sel.event_id,

      d.driver_id,
      d.full_name,

      v.vehicle_id,
      v.register_number,

      dp.depot_code,
      dp.depot_name,

      st.event_code,
      st.event_name,

      sel.severity_code,

      sel.event_timestamp,

      er.review_status,
      er.review_date,

      er.decision,
      er.comments

    FROM safety_event_log sel

    INNER JOIN event_review er
      ON sel.event_id = er.event_id

    INNER JOIN driver d
      ON sel.driver_id = d.driver_id

    INNER JOIN vehicle v
      ON sel.vehicle_id = v.vehicle_id

    INNER JOIN depot dp
      ON sel.depot_code = dp.depot_code

    INNER JOIN safety_event_type st
      ON sel.event_code = st.event_code

    WHERE 1=1
  `;

  const params: any[] = [];

  if (filters.driverId) {
    sql += `
      AND (
        d.driver_id = ?
        OR d.full_name LIKE ?
      )`;
    params.push(filters.driverId);
    params.push(`%${filters.driverId}%`);
  }

  if (filters.vehicleId) {
    sql += " AND v.register_number LIKE ?";
    params.push(`%${filters.vehicleId}%`);
  }

  if (filters.depotCode) {
    sql += " AND sel.depot_code = ?";
    params.push(filters.depotCode);
  }

  if (filters.eventCode) {
    sql += " AND sel.event_code = ?";
    params.push(filters.eventCode);
  }

  if (filters.severityCode) {
    sql += " AND sel.severity_code = ?";
    params.push(filters.severityCode);
  }

  if (filters.reviewStatus) {
    sql += " AND er.review_status = ?";
    params.push(filters.reviewStatus);
  }

  if (filters.startDate) {
    sql += " AND DATE(sel.event_timestamp) >= ?";
    params.push(filters.startDate);
  }

  if (filters.endDate) {
    sql += " AND DATE(sel.event_timestamp) <= ?";
    params.push(filters.endDate);
  }

  sql += `
    ORDER BY
      sel.event_timestamp DESC
  `;

  const [rows] =
    await pool.query<(IncidentReview & RowDataPacket)[]>(
      sql,
      params
    );

  return rows;
}

/* =======================================================
   UNRESOLVED INCIDENTS
======================================================= */

export async function getUnresolvedIncidentReviews() {

  const [rows] =
    await pool.query<(IncidentReview & RowDataPacket)[]>(`
      SELECT

        er.review_id,

        sel.event_id,

        d.driver_id,
        d.full_name,

        v.vehicle_id,
        v.register_number,

        dp.depot_code,
        dp.depot_name,

        st.event_code,
        st.event_name,

        sel.severity_code,

        sel.event_timestamp,

        er.review_status,

        er.review_date,

        er.decision,

        er.comments

      FROM event_review er

      INNER JOIN safety_event_log sel
        ON er.event_id = sel.event_id

      INNER JOIN driver d
        ON sel.driver_id = d.driver_id

      INNER JOIN vehicle v
        ON sel.vehicle_id = v.vehicle_id

      INNER JOIN depot dp
        ON sel.depot_code = dp.depot_code

      INNER JOIN safety_event_type st
        ON sel.event_code = st.event_code

      WHERE
        er.review_status IN (
          'Pending',
          'In Progress'
        )

      ORDER BY
        sel.event_timestamp ASC
    `);

  return rows;
}

/* =======================================================
   UPDATE REVIEW
======================================================= */

export async function updateIncidentReview(
  reviewId: number,
  decision: string,
  comments: string
) {

  await pool.query(
    `
    UPDATE event_review

    SET

      decision = ?,

      comments = ?,

      review_status = 'Completed',

      review_date = NOW()

    WHERE
      review_id = ?
    `,
    [
      decision,
      comments,
      reviewId,
    ]
  );

}
