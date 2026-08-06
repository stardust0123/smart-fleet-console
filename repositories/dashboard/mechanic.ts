import pool from "@/lib/db";

// 1. Vehicle Maintenance History
// NOTE: added mj.job_id + mj.job_status (not in the original SELECT list) because
// the "change job status" feature (Hinh 5) is impossible without them — every other
// column matches the query exactly as provided.
export async function getVehicleMaintenanceHistory() {
  const sql = `
    SELECT
      mj.job_id,
      mj.job_status,
      v.register_number,
      v.model,
      v.odometer_km,
      v.status_code,
      mj.open_date,
      mj.close_date,
      act.activity_name,
      p.part_name,
      ap.quantity_used
    FROM vehicle v
    JOIN maintenance_job mj
      ON mj.vehicle_id = v.vehicle_id
    JOIN maintenance_activity ma
      ON ma.job_id = mj.job_id
    JOIN activity_type act
      ON act.activity_code = ma.activity_code
    LEFT JOIN activity_parts ap
      ON ma.activity_id = ap.activity_id
    LEFT JOIN parts p
      ON ap.part_number = p.part_number
    ORDER BY mj.close_date DESC;
  `;

  const [rows] = await pool.query(sql);
  return rows;
}

// 2. Diagnostic Records
export async function getDiagnosticRecords() {
  const sql = `
    SELECT
      v.register_number,
      v.model,
      mj.open_date,
      mj.close_date,
      act.activity_name,
      ma.diagnostic_result
    FROM vehicle v
    JOIN maintenance_job mj
      ON mj.vehicle_id = v.vehicle_id
    JOIN maintenance_activity ma
      ON ma.job_id = mj.job_id
    JOIN activity_type act
      ON act.activity_code = ma.activity_code
    ORDER BY mj.close_date DESC;
  `;

  const [rows] = await pool.query(sql);
  return rows;
}

// 3. Previous Repair Information
export async function getPreviousRepairInfo() {
  const sql = `
    SELECT
      v.register_number,
      mj.close_date AS repair_date,
      act.activity_name,
      p.part_name,
      p.part_number,
      ap.quantity_used
    FROM vehicle v
    JOIN maintenance_job mj
      ON mj.vehicle_id = v.vehicle_id
    JOIN maintenance_activity ma
      ON ma.job_id = mj.job_id
    JOIN activity_type act
      ON act.activity_code = ma.activity_code
    JOIN activity_parts ap
      ON ma.activity_id = ap.activity_id
    JOIN parts p
      ON ap.part_number = p.part_number
    ORDER BY mj.close_date DESC;
  `;

  const [rows] = await pool.query(sql);
  return rows;
}

// 4. Mechanic Certification Information (scoped to the logged-in mechanic_id)
export async function getMechanicCertifications(mechanicId: string) {
  const sql = `
    SELECT
      m.mechanic_id,
      m.full_name,
      mct.certification_name,
      mc.issue_date,
      mc.expire_date
    FROM mechanic m
    JOIN mechanics_certifications mc
      ON mc.mechanic_id = m.mechanic_id
    JOIN mechanic_certification_type mct
      ON mct.certification_code = mc.certification_code
    WHERE m.mechanic_id = ?
    ORDER BY m.mechanic_id ASC;
  `;

  const [rows] = await pool.query(sql, [mechanicId]);
  return rows;
}

// 5. Historical Jobs & Activities Assigned (scoped to the logged-in mechanic_id)
// NOTE: added mj.job_status, mj.open_date, mj.close_date — same reasoning as #1,
// without a status there is nothing to chart / nothing to tell "historical" apart
// from "currently assigned". job_id / activity_code kept exactly as given.
export async function getMechanicHistoricalJobs(mechanicId: string) {
  const sql = `
    SELECT
      m.mechanic_id,
      m.full_name,
      mj.job_id,
      mj.job_status,
      mj.open_date,
      mj.close_date,
      ma.activity_code
    FROM mechanic m
    JOIN activity_assignment aa
      ON aa.mechanic_id = m.mechanic_id
    JOIN maintenance_activity ma
      ON ma.activity_id = aa.activity_id
    JOIN maintenance_job mj
      ON mj.job_id = ma.job_id
    WHERE m.mechanic_id = ?
    ORDER BY mj.open_date DESC;
  `;

  const [rows] = await pool.query(sql, [mechanicId]);
  return rows;
}

// 6. Update Maintenance Job Status
export async function updateMaintenanceJobStatus(
  jobId: string,
  status: string
) {
  const updateSql = `
    UPDATE maintenance_job
    SET job_status = ?
    WHERE job_id = ?;
  `;

  await pool.query(updateSql, [status, jobId]);

  const verifySql = `
    SELECT *
    FROM maintenance_job
    WHERE job_id = ?
      AND job_status = ?;
  `;

  const [rows] = await pool.query(verifySql, [jobId, status]);
  return rows;
}

// 7. Vehicle picklist for the "Create Job" form in Explorer (id + label only)
export async function getVehicleOptions() {
  const sql = `
    SELECT vehicle_id, register_number, model
    FROM vehicle
    ORDER BY register_number ASC;
  `;
  const [rows] = await pool.query(sql);
  return rows;
}

// 8. Insert a new maintenance job (mechanic reporting a new job opened on a vehicle).
// Only columns confirmed to exist from the queries above are used
// (job_id, vehicle_id, open_date, job_status). job_id is generated here since no
// auto-increment/UUID convention was specified.
export async function createMaintenanceJob(vehicleId: string) {
  const jobId = `JB${Date.now().toString().slice(-8)}`;

  const insertSql = `
    INSERT INTO maintenance_job (job_id, vehicle_id, open_date, job_status)
    VALUES (?, ?, NOW(), 'Pending');
  `;
  await pool.query(insertSql, [jobId, vehicleId]);

  const [rows] = await pool.query(
    `SELECT * FROM maintenance_job WHERE job_id = ?;`,
    [jobId]
  );
  return rows;
}

// 9. Completed jobs for this mechanic (Dashboard "Completed Jobs" table)
// WHERE mj.job_status = 'Completed' 
export async function getCompletedJobsByMechanic(mechanicId: string) {
  const sql = `
    SELECT
      v.register_number,
      v.model,
      m.mechanic_id,
      m.full_name,
      mj.job_id,
      mj.open_date,
      mj.close_date,
      ma.activity_code,
      mj.job_status
    FROM mechanic m
    JOIN activity_assignment aa ON aa.mechanic_id = m.mechanic_id
    JOIN maintenance_activity ma ON ma.activity_id = aa.activity_id
    JOIN maintenance_job mj ON mj.job_id = ma.job_id
    JOIN vehicle v ON v.vehicle_id = mj.vehicle_id
    WHERE m.mechanic_id = ?
      AND mj.job_status = 'Completed'
    ORDER BY mj.close_date DESC;
  `;
  const [rows] = await pool.query(sql, [mechanicId]);
  return rows;
}

// 10. Total labour hours for this mechanic (new stat card)
export async function getMechanicTotalLabourHours(mechanicId: string) {
  const sql = `
    SELECT
      m.mechanic_id,
      m.full_name,
      SUM(aa.labour_hours) AS total_labour_hours
    FROM mechanic m
    JOIN activity_assignment aa ON aa.mechanic_id = m.mechanic_id
    WHERE m.mechanic_id = ?
    GROUP BY m.mechanic_id, m.full_name;
  `;
  const [rows] = await pool.query(sql, [mechanicId]);
  return (rows as any[])[0] ?? null;
}

// 11. Full assigned-jobs list for Explorer (replaces the generic maintenance
// history query there — this one carries mechanic_id/full_name which Explorer
// now needs to display).
export async function getMechanicAssignedJobsFull(mechanicId: string) {
  const sql = `
    SELECT
      v.register_number,
      v.model,
      m.mechanic_id,
      m.full_name,
      mj.job_id,
      ma.activity_code,
      mj.open_date,
      mj.close_date,
      mj.job_status
    FROM mechanic m
    JOIN activity_assignment aa ON aa.mechanic_id = m.mechanic_id
    JOIN maintenance_activity ma ON ma.activity_id = aa.activity_id
    JOIN maintenance_job mj ON mj.job_id = ma.job_id
    JOIN vehicle v ON v.vehicle_id = mj.vehicle_id
    WHERE m.mechanic_id = ?
    ORDER BY mj.open_date DESC;
  `;
  const [rows] = await pool.query(sql, [mechanicId]);
  return rows;
}

// 11b. Full assigned-jobs list for Explorer — ALL mechanics (fleet-wide), not
// just the logged-in one. Same columns as getMechanicAssignedJobsFull, just
// without the WHERE m.mechanic_id = ? filter.
export async function getAllAssignedJobsFull() {
  const sql = `
    SELECT
      v.register_number,
      v.model,
      m.mechanic_id,
      m.full_name,
      mj.job_id,
      ma.activity_code,
      mj.open_date,
      mj.close_date,
      mj.job_status
    FROM mechanic m
    JOIN activity_assignment aa ON aa.mechanic_id = m.mechanic_id
    JOIN maintenance_activity ma ON ma.activity_id = aa.activity_id
    JOIN maintenance_job mj ON mj.job_id = ma.job_id
    JOIN vehicle v ON v.vehicle_id = mj.vehicle_id
    ORDER BY mj.open_date DESC;
  `;
  const [rows] = await pool.query(sql);
  return rows;
}

// 11c. Explorer jobs with server-side filters (WHERE built dynamically)
export async function getAllAssignedJobsFiltered(filters: {
  register_number?: string;
  model?: string;
  mechanic_id?: string;
  activity_code?: string;
  job_status?: string;
}) {
  const conditions: string[] = [];
  const params: string[] = [];

  if (filters.register_number) {
    conditions.push('v.register_number LIKE ?');
    params.push(`%${filters.register_number}%`);
  }
  if (filters.model) {
    conditions.push('v.model LIKE ?');
    params.push(`%${filters.model}%`);
  }
  if (filters.mechanic_id) {
    conditions.push('m.mechanic_id LIKE ?');
    params.push(`%${filters.mechanic_id}%`);
  }
  if (filters.activity_code) {
    conditions.push('ma.activity_code LIKE ?');
    params.push(`%${filters.activity_code}%`);
  }
  if (filters.job_status) {
    conditions.push('mj.job_status = ?');
    params.push(filters.job_status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT
      v.register_number,
      v.model,
      m.mechanic_id,
      m.full_name,
      mj.job_id,
      ma.activity_code,
      mj.open_date,
      mj.close_date,
      mj.job_status
    FROM mechanic m
    JOIN activity_assignment aa ON aa.mechanic_id = m.mechanic_id
    JOIN maintenance_activity ma ON ma.activity_id = aa.activity_id
    JOIN maintenance_job mj ON mj.job_id = ma.job_id
    JOIN vehicle v ON v.vehicle_id = mj.vehicle_id
    ${whereClause}
    ORDER BY mj.open_date DESC;
  `;

  const [rows] = await pool.query(sql, params);
  return rows;
}

// 12. Suggested pending jobs this mechanic is certified + unassigned for + depot.
// NOTE: added ma.activity_id to the SELECT list (not in your original query) —
// it is the only thing missing to let the mechanic actually take/assign the job
// afterwards (activity_assignment is keyed by activity_id, not job_id).
// Every other column matches query exactly.
export async function getSuggestedJobsForMechanic(mechanicId: string) {
  const sql = `
    SELECT DISTINCT
      mj.job_id,
      ma.activity_id,
      v.register_number,
      v.model,
      act.activity_name,
      mct.certification_name,
      mj.job_status
    FROM maintenance_job mj
    JOIN vehicle v ON mj.vehicle_id = v.vehicle_id
    JOIN maintenance_activity ma ON ma.job_id = mj.job_id
    JOIN activity_type act ON act.activity_code = ma.activity_code
    JOIN mechanic_certification_type mct ON mct.certification_code = act.certification_code
    LEFT JOIN activity_assignment aa ON aa.activity_id = ma.activity_id
    WHERE
      mj.job_status = 'Pending'
      AND aa.mechanic_id IS NULL
      AND EXISTS (
        SELECT 1
        FROM mechanics_certifications mc
        WHERE mc.mechanic_id = ?
          AND mc.certification_code = act.certification_code
      )
      AND v.depot_code = (
        SELECT d.depot_code
        FROM mechanic m
        JOIN workshop w ON w.workshop_id = m.workshop_id
        JOIN depot d ON d.depot_code = w.depot_code
        WHERE m.mechanic_id = ?
      )
    ORDER BY mj.job_id ASC;
  `;
  const [rows] = await pool.query(sql, [mechanicId, mechanicId]);
  return rows;
}

// 13. Mechanic takes a suggested job — assigns themselves to the activity.
export async function assignMechanicToActivity(
  mechanicId: string,
  activityId: string,
  labourHours: number = 0
) {
  const insertSql = `
    INSERT INTO activity_assignment (mechanic_id, activity_id, labour_hours)
    VALUES (?, ?, ?);
  `;
  await pool.query(insertSql, [mechanicId, activityId, labourHours]);

  const [rows] = await pool.query(
    `SELECT * FROM activity_assignment WHERE mechanic_id = ? AND activity_id = ?;`,
    [mechanicId, activityId]
  );
  return rows;
}

// 14. Mechanic profile info (for "Hi, {full_name} - {depot_code}" header)
export async function getMechanicProfile(mechanicId: string) {
  const sql = `
    SELECT
      m.mechanic_id,
      m.full_name,
      m.workshop_id,
      d.depot_code
    FROM mechanic m
    JOIN workshop w ON w.workshop_id = m.workshop_id
    JOIN depot d ON d.depot_code = w.depot_code
    WHERE m.mechanic_id = ?;
  `;
  const [rows] = await pool.query(sql, [mechanicId]);
  return (rows as any[])[0] ?? null;
}

// 15. One-off data cleanup: normalize job_status values that were inserted
// inconsistently (e.g. "COMPLETED", "completed", "In Progress", "INPROGRESS")
// back to the canonical set: 'Pending' | 'InProgress' | 'Completed'.
export async function normalizeJobStatusValues() {
  const updateSql = `
    UPDATE maintenance_job
    SET job_status = CASE
      WHEN LOWER(REPLACE(job_status, ' ', '')) = 'pending' THEN 'Pending'
      WHEN LOWER(REPLACE(job_status, ' ', '')) = 'inprogress' THEN 'InProgress'
      WHEN LOWER(REPLACE(job_status, ' ', '')) = 'completed' THEN 'Completed'
      ELSE job_status
    END
    WHERE LOWER(REPLACE(job_status, ' ', '')) IN ('pending', 'inprogress', 'completed');
  `;

  const [result] = await pool.query(updateSql);
  return result; // contains affectedRows / changedRows for verification
}

// 16. Verification helper — list any remaining job_status values that don't
// match the canonical set, so you can confirm the cleanup above worked.
export async function getDistinctJobStatusValues() {
  const sql = `
    SELECT job_status, COUNT(*) AS total
    FROM maintenance_job
    GROUP BY job_status
    ORDER BY job_status;
  `;
  const [rows] = await pool.query(sql);
  return rows;
}