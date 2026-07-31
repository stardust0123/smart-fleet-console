import pool from "@/lib/db";
import { ManagerDashboardStats } from "@/types/dashboard";

export async function getManagerDashboardStats(): Promise<ManagerDashboardStats> {
  const [
    [vehicleRows],
    [jobRows],
    [alertRows],
    [mechanicRows],
  ] = await Promise.all([
    pool.query(`
      SELECT COUNT(*) AS totalVehicles
      FROM vehicle;
    `),

    pool.query(`
      SELECT COUNT(*) AS openJobs
      FROM maintenance_job
      WHERE close_date IS NULL;
    `),

    pool.query(`
      SELECT COUNT(*) AS predictiveAlerts
      FROM predictive_alert_log
      WHERE job_id IS NULL;
    `),

    pool.query(`
      SELECT COUNT(*) AS mechanicsAvailable
      FROM mechanic;
    `),
  ]);

  return {
    totalVehicles: (vehicleRows as any[])[0].totalVehicles,
    openJobs: (jobRows as any[])[0].openJobs,
    predictiveAlerts: (alertRows as any[])[0].predictiveAlerts,
    mechanicsAvailable: (mechanicRows as any[])[0].mechanicsAvailable,
  };
}

export async function getWorkshopWorkload() {
  const [rows] = await pool.query(`
    SELECT
      w.workshop_name,
      COUNT(*) AS totalJobs
    FROM maintenance_job mj
    JOIN workshop w
      ON mj.workshop_id = w.workshop_id
    GROUP BY w.workshop_name
    ORDER BY totalJobs DESC;
  `);

  return rows as {
    workshop_name: string;
    totalJobs: number;
  }[];
}

export async function getPredictiveAlertDistribution() {
  const [rows] = await pool.query(`
    SELECT
      pat.alert_name,
      COUNT(*) AS totalAlerts
    FROM predictive_alert_log pal
    JOIN predictive_alert_type pat
      ON pal.alert_code = pat.alert_code
    GROUP BY pat.alert_name
    ORDER BY totalAlerts DESC;
  `);

  return rows as {
    alert_name: string;
    totalAlerts: number;
  }[];
}

export async function getTopVehiclesWithAlerts() {
  const [rows] = await pool.query(`
    SELECT
      v.register_number,
      COUNT(*) AS totalAlerts
    FROM predictive_alert_log pal
    JOIN vehicle v
      ON pal.vehicle_id = v.vehicle_id
    GROUP BY
      v.vehicle_id,
      v.register_number
    ORDER BY totalAlerts DESC
    LIMIT 10;
  `);

  return rows as {
    register_number: string;
    totalAlerts: number;
  }[];
}

export async function getTopAlertTypes() {
  const [rows] = await pool.query(`
    SELECT
      pat.alert_name,
      COUNT(*) AS totalAlerts
    FROM predictive_alert_log pal
    JOIN predictive_alert_type pat
      ON pal.alert_code = pat.alert_code
    GROUP BY
      pat.alert_code,
      pat.alert_name
    ORDER BY totalAlerts DESC
    LIMIT 10;
  `);

  return rows as {
    alert_name: string;
    totalAlerts: number;
  }[];
}

export async function getUrgentRepairs() {
  const [rows] = await pool.query(`
    SELECT
      pal.alert_id,
      pal.alert_timestamp,
      v.register_number,
      pat.alert_name,
      pal.following_action,
      v.status_code

    FROM predictive_alert_log pal

    JOIN predictive_alert_type pat
      ON pal.alert_code = pat.alert_code

    JOIN vehicle v
      ON v.vehicle_id = pal.vehicle_id

    WHERE
      pal.following_action = 'Immediate workshop visit'
      AND pal.job_id IS NULL

    ORDER BY
      pal.alert_timestamp DESC

    LIMIT 10;
  `);

  return rows as {
    alert_id: string;
    register_number: string;
    alert_name: string;
    following_action: string;
    status_code: string;
    alert_timestamp: Date;
  }[];
}