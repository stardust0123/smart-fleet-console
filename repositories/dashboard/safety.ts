import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

import {
  SafetyDashboardKPIs,
  RecentIncidentReview,
  HighRiskDriver,
  SafetyTrend,
  RetrainingQueue,
  SeverityDistribution
  
} from "@/types/dashboard";

/* =======================================================
   KPI CARDS
======================================================= */

export async function getSafetyKPIs() {

  const [[row]] =
    await pool.query<
      (SafetyDashboardKPIs & RowDataPacket)[]
    >(`
      SELECT

        (
          SELECT COUNT(*)
          FROM event_review
          WHERE review_status IN (
            'Pending',
            'In Progress'
          )
        ) AS pendingReviews,

        (
          SELECT COUNT(*)
          FROM safety_score
          WHERE safety_score <= 75
        ) AS highRiskDrivers,

        (
          SELECT COUNT(*)
          FROM coaching_retraining
          WHERE training_status <> 'Completed'
        ) AS retrainingRequired,

        (
          SELECT COUNT(*)
          FROM safety_event_log
          WHERE severity_code IN (
            'HIGH',
            'CRIT'
          )
        ) AS criticalIncidents
    `);

  return row;
}

/* =======================================================
   RECENT INCIDENT REVIEWS
======================================================= */

export async function getRecentIncidentReviews() {

  const [rows] =
    await pool.query<
      (RecentIncidentReview & RowDataPacket)[]
    >(`
      SELECT

        er.review_id,

        d.driver_id,

        d.full_name,

        st.event_name,

        sel.severity_code,

        sel.event_timestamp,

        er.review_status

      FROM event_review er

      INNER JOIN safety_event_log sel
        ON er.event_id = sel.event_id

      INNER JOIN driver d
        ON sel.driver_id = d.driver_id

      INNER JOIN safety_event_type st
        ON sel.event_code = st.event_code

      ORDER BY
        sel.event_timestamp DESC

      LIMIT 10
    `);

  return rows;
}

/* =======================================================
   HIGH RISK DRIVERS
======================================================= */

export async function getHighRiskDriversDashboard() {

  const [rows] =
    await pool.query<
      (HighRiskDriver & RowDataPacket)[]
    >(`
      SELECT

        d.driver_id,

        d.full_name,

        dp.depot_name,

        ss.score_month,

        ss.safety_score,

        ss.comments

      FROM safety_score ss

      INNER JOIN driver d
        ON ss.driver_id = d.driver_id

      INNER JOIN depot dp
        ON d.depot_code = dp.depot_code

      WHERE
        ss.safety_score <= 75

      ORDER BY
        ss.safety_score ASC

      LIMIT 10
    `);

  return rows;
}

/* =======================================================
   SAFETY TREND
======================================================= */

export async function getSafetyTrendMatrix() {

  const [rows] =
    await pool.query<
      (SafetyTrend & RowDataPacket)[]
    >(`
      SELECT

        depot_code,

        SUM(CASE WHEN event_code='ACL' THEN 1 ELSE 0 END) AS ACL,

        SUM(CASE WHEN event_code='BRK' THEN 1 ELSE 0 END) AS BRK,

        SUM(CASE WHEN event_code='FTG' THEN 1 ELSE 0 END) AS FTG,

        SUM(CASE WHEN event_code='IDL' THEN 1 ELSE 0 END) AS IDL,

        SUM(CASE WHEN event_code='PHO' THEN 1 ELSE 0 END) AS PHO,

        SUM(CASE WHEN event_code='SB' THEN 1 ELSE 0 END) AS SB,

        SUM(CASE WHEN event_code='SCN' THEN 1 ELSE 0 END) AS SCN,

        SUM(CASE WHEN event_code='SPD' THEN 1 ELSE 0 END) AS SPD,

        COUNT(*) AS total_events

      FROM safety_event_log

      GROUP BY depot_code

      ORDER BY depot_code
    `);

  return rows;
}

/* =======================================================
   RETRAINING QUEUE
======================================================= */

export async function getRetrainingQueue() {

  const [rows] =
    await pool.query<
      (RetrainingQueue & RowDataPacket)[]
    >(`
      SELECT

        cr.training_id,

        COALESCE(
          sel.driver_id,
          ss.driver_id
        ) AS driver_id,

        d.full_name,

        cr.training_type,

        cr.start_date,

        cr.end_date,

        cr.training_status,

        cr.outcome,

        CASE

          WHEN cr.review_id IS NOT NULL
            THEN 'Incident Review'

          WHEN cr.score_id IS NOT NULL
            THEN 'Safety Score'

        END AS training_source

      FROM coaching_retraining cr

      LEFT JOIN event_review er
        ON cr.review_id = er.review_id

      LEFT JOIN safety_event_log sel
        ON er.event_id = sel.event_id

      LEFT JOIN safety_score ss
        ON cr.score_id = ss.score_id

      INNER JOIN driver d
        ON d.driver_id =
          COALESCE(
            sel.driver_id,
            ss.driver_id
          )

      ORDER BY
        cr.start_date DESC

      LIMIT 10
    `);

  return rows;
}

export async function getIncidentSeverityDistribution() {

  const [rows] =
    await pool.query<(SeverityDistribution & RowDataPacket)[]>(`

      SELECT

        severity_code,

        COUNT(*) AS total

      FROM safety_event_log

      GROUP BY severity_code

      ORDER BY FIELD(

        severity_code,

        'LOW',

        'MED',

        'HIGH',

        'CRIT'

      )

    `);

  return rows;

}