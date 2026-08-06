import pool from "@/lib/db";
import { ManagerDashboardStats } from "@/types/dashboard";

// Retrieve core stats for the top summary cards
export async function getManagerDashboardStats(): Promise<ManagerDashboardStats> {
  const [
    [vehicleRows],
    [jobRows],
    [alertRows],
    [mechanicRows],
    [lowStockRows],
    [overdueRows],
    [awaitingRows],
  ] = await Promise.all([
    pool.query(`SELECT COUNT(*) AS count FROM vehicle;`),
    
    pool.query(`SELECT COUNT(*) AS count FROM maintenance_job WHERE close_date IS NULL;`),
    
    pool.query(`SELECT COUNT(*) AS count FROM predictive_alert_log WHERE job_id IS NULL;`),
    
    pool.query(`SELECT COUNT(*) AS count FROM mechanic;`),

    // New: Count parts falling below reorder threshold
    pool.query(`SELECT COUNT(*) AS count FROM parts WHERE quantity < re_order_threshold;`),

    // New: Count vehicles overdue for service (>= 180 days since last maintenance)
    pool.query(`
      SELECT COUNT(*) AS count FROM (
        SELECT v.vehicle_id 
        FROM vehicle v
        JOIN maintenance_job mj ON mj.vehicle_id = v.vehicle_id
        GROUP BY v.vehicle_id
        HAVING DATEDIFF(CURDATE(), MAX(mj.close_date)) >= 180
      ) AS overdue;
    `),

    // New: Count vehicles awaiting inspection (AIN status)
    pool.query(`SELECT COUNT(*) AS count FROM vehicle WHERE status_code = 'AIN';`),
  ]);

  return {
    totalVehicles: (vehicleRows as any[])[0].count,
    openJobs: (jobRows as any[])[0].count,
    predictiveAlerts: (alertRows as any[])[0].count,
    mechanicsAvailable: (mechanicRows as any[])[0].count,
    lowStockParts: (lowStockRows as any[])[0].count,
    overdueVehicles: (overdueRows as any[])[0].count,
    awaitingInspection: (awaitingRows as any[])[0].count,
  };
}

// Analyze workshop workload
export async function getWorkshopWorkload() {
  const [rows] = await pool.query(`
    SELECT
      w.workshop_name,
      COUNT(*) AS totalJobs
    FROM maintenance_job mj
    JOIN workshop w ON mj.workshop_id = w.workshop_id
    GROUP BY w.workshop_name
    ORDER BY totalJobs DESC;
  `);
  return rows as { workshop_name: string; totalJobs: number }[];
}

// Distribute predictive alerts by type
export async function getPredictiveAlertDistribution() {
  const [rows] = await pool.query(`
    SELECT
      pat.alert_name,
      COUNT(*) AS totalAlerts
    FROM predictive_alert_log pal
    JOIN predictive_alert_type pat ON pal.alert_code = pat.alert_code
    GROUP BY pat.alert_name
    ORDER BY totalAlerts DESC;
  `);
  return rows as { alert_name: string; totalAlerts: number }[];
}

// Identify top vehicles generating alerts
export async function getTopVehiclesWithAlerts() {
  const [rows] = await pool.query(`
    SELECT
      v.register_number,
      COUNT(*) AS totalAlerts
    FROM predictive_alert_log pal
    JOIN vehicle v ON pal.vehicle_id = v.vehicle_id
    GROUP BY v.vehicle_id, v.register_number
    ORDER BY totalAlerts DESC
    LIMIT 10;
  `);
  return rows as { register_number: string; totalAlerts: number }[];
}

// Identify top predictive alert types
export async function getTopAlertTypes() {
  const [rows] = await pool.query(`
    SELECT
      pat.alert_name,
      COUNT(*) AS totalAlerts
    FROM predictive_alert_log pal
    JOIN predictive_alert_type pat ON pal.alert_code = pat.alert_code
    GROUP BY pat.alert_code, pat.alert_name
    ORDER BY totalAlerts DESC
    LIMIT 10;
  `);
  return rows as { alert_name: string; totalAlerts: number }[];
}

// Retrieve queue for urgent immediate repairs
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
    JOIN predictive_alert_type pat ON pal.alert_code = pat.alert_code
    JOIN vehicle v ON v.vehicle_id = pal.vehicle_id
    WHERE pal.following_action = 'Immediate workshop visit' 
      AND pal.job_id IS NULL
    ORDER BY pal.alert_timestamp DESC
    LIMIT 10;
  `);
  return rows as { alert_id: string; register_number: string; alert_name: string; following_action: string; status_code: string; alert_timestamp: Date }[];
}

// Analyze maintenance cost and downtime by vehicle model
export async function getCostAndDowntimeByModel() {
  const [rows] = await pool.query(`
    SELECT 
      v.model AS vehicle_model, 
      AVG(mj.downtime_hours) AS avg_downtime_hours, 
      AVG(mj.total_cost_vnd) AS avg_maintenance_cost
    FROM maintenance_job mj
    JOIN vehicle v ON mj.vehicle_id = v.vehicle_id
    GROUP BY v.model
    ORDER BY avg_maintenance_cost DESC;
  `);
  return rows as { vehicle_model: string; avg_downtime_hours: number; avg_maintenance_cost: number }[];
}

// List available mechanics and their active certifications
export async function getAvailableMechanicsWithCerts() {
  const [rows] = await pool.query(`
    SELECT 
      m.mechanic_id, 
      m.full_name, 
      m.phone,
      GROUP_CONCAT(mc.certification_code SEPARATOR ', ') AS active_certifications
    FROM mechanic m
    LEFT JOIN mechanics_certifications mc 
      ON m.mechanic_id = mc.mechanic_id 
      AND mc.expire_date >= CURDATE()
    GROUP BY m.mechanic_id, m.full_name, m.phone;
  `);
  return rows as { mechanic_id: string; full_name: string; phone: string; active_certifications: string | null }[];
}

// Identify vehicles with repeated faults for the same component
export async function getRepeatedFaults() {
  const [rows] = await pool.query(`
    SELECT 
      v.register_number, 
      v.category_code,
      ma.activity_code AS fault_description,
      MAX(ma.start_date) AS last_failed_date
    FROM maintenance_activity ma
    JOIN maintenance_job mj ON ma.job_id = mj.job_id
    JOIN vehicle v ON mj.vehicle_id = v.vehicle_id
    GROUP BY v.register_number, v.category_code, ma.activity_code
    HAVING COUNT(ma.activity_code) > 1
    ORDER BY last_failed_date DESC
    LIMIT 10;
  `);
  return rows as { register_number: string; category_code: string; fault_description: string; last_failed_date: Date }[];
}

// --- NEW OPERATIONS MANAGEMENT FUNCTIONS ---

// Identify vehicles overdue for service (>= 180 days)
export async function getOverdueVehicles() {
  const [rows] = await pool.query(`
    SELECT
      v.vehicle_id,
      v.register_number,
      v.model,
      v.odometer_km,
      v.status_code,
      MAX(mj.close_date) AS last_maintenance_date,
      DATEDIFF(CURDATE(), MAX(mj.close_date)) AS days_since_last_maintenance
    FROM vehicle v
    JOIN maintenance_job mj ON mj.vehicle_id = v.vehicle_id
    GROUP BY v.vehicle_id, v.register_number, v.model, v.odometer_km, v.status_code
    HAVING days_since_last_maintenance >= 180
    ORDER BY days_since_last_maintenance DESC;
  `);
  return rows as { vehicle_id: string; register_number: string; model: string; odometer_km: number; status_code: string; last_maintenance_date: Date; days_since_last_maintenance: number }[];
}

// Identify vehicles awaiting inspection
export async function getAwaitingInspectionVehicles() {
  const [rows] = await pool.query(`
    SELECT
      vehicle_id,
      model,
      register_number,
      status_code
    FROM vehicle
    WHERE status_code = 'AIN'
    ORDER BY vehicle_id ASC;
  `);
  return rows as { vehicle_id: string; model: string; register_number: string; status_code: string }[];
}

// Identify parts below reorder thresholds
export async function getLowStockParts() {
  const [rows] = await pool.query(`
    SELECT
      part_name,
      quantity,
      re_order_threshold
    FROM parts
    WHERE quantity < re_order_threshold
    ORDER BY part_name DESC;
  `);
  return rows as { part_name: string; quantity: number; re_order_threshold: number }[];
}

// Monitor supplier performance (Primary vs Backup pricing)
export async function getSupplierPerformance() {
  const [rows] = await pool.query(`
    WITH part_backup AS (
      SELECT 
        part_number AS part_number_2, 
        supplier_id AS supplier_id_2, 
        supplier_priority AS supplier_priority_2, 
        unit_price AS unit_price_2
      FROM parts_suppliers
      WHERE supplier_priority = 'Backup'
    ),
    part_primary AS (
      SELECT 
        part_number AS part_number_1, 
        supplier_id AS supplier_id_1, 
        supplier_priority AS supplier_priority_1, 
        unit_price AS unit_price_1
      FROM parts_suppliers
      WHERE supplier_priority = 'Primary'
    )
    SELECT 
      pp.part_number_1, 
      pp.supplier_id_1, 
      pp.unit_price_1, 
      pb.supplier_id_2, 
      pb.unit_price_2,
      ((pb.unit_price_2 - pp.unit_price_1) / pb.unit_price_2) * 100 AS percentage_diff
    FROM part_primary pp
    JOIN part_backup pb ON pb.part_number_2 = pp.part_number_1;
  `);
  return rows as { part_number_1: string; supplier_id_1: string; unit_price_1: number; supplier_id_2: string; unit_price_2: number; percentage_diff: number }[];
}

// --- NEW FUNCTION: PHASE 2 ---

// Identify mechanics with certifications expiring within the next 30 days
export async function getExpiringCertificates() {
  const [rows] = await pool.query(`
    SELECT 
      m.mechanic_id, 
      m.full_name, 
      mc.certification_code, 
      mc.expire_date 
    FROM mechanic m
    JOIN mechanics_certifications mc ON m.mechanic_id = mc.mechanic_id
    WHERE mc.expire_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    ORDER BY mc.expire_date ASC;
  `);
  return rows as { mechanic_id: string; full_name: string; certification_code: string; expire_date: Date }[];
}