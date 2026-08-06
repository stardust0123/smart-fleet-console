import pool from "@/lib/db";

// 1. DTO for Workshop Explorer Filters
export interface WorkshopFilters {
  vehicle_id?: string;
  mechanic_id?: string;
  alert_type?: string;
  startDate?: string;
  endDate?: string;
}

// 2. Fetch Predictive Maintenance Alerts Safely
export async function getPredictiveAlerts(filters: WorkshopFilters) {
  try {
    // JOIN predictive_alert_log with predictive_alert_type to get the clear alert_name for display
    let query = `
      SELECT 
        pal.alert_id,
        pal.alert_timestamp AS timestamp,
        pal.vehicle_id,
        pat.alert_name AS alert_type, 
        'Attention' AS severity, 
        pal.following_action AS description
      FROM predictive_alert_log pal
      LEFT JOIN predictive_alert_type pat ON pal.alert_code = pat.alert_code
      WHERE 1=1
    `;
    const values: any[] = [];

    if (filters.vehicle_id) { 
      query += ` AND pal.vehicle_id = ?`; 
      values.push(filters.vehicle_id); 
    }
    
    // The dropdown now sends the exact alert_code, so we use the '=' operator for precise matching
    if (filters.alert_type) { 
      query += ` AND pal.alert_code = ?`; 
      values.push(filters.alert_type); 
    }
    
    // Filter by the specific timestamp column in your database
    if (filters.startDate) {
      query += ` AND pal.alert_timestamp >= ?`;
      values.push(`${filters.startDate} 00:00:00`);
    }
    
    query += ` ORDER BY pal.alert_timestamp DESC LIMIT 500;`;
    
    const [rows] = await pool.query(query, values);
    return rows as any[];
  } catch (error) {
    console.error("Alert Fetch Error:", error);
    return [];
  }
}

// 3. Fetch Maintenance History with Mechanic Details
export async function getMaintenanceHistory(filters: WorkshopFilters) {
  try {
    let query = `
      SELECT 
        mj.job_id, 
        mj.vehicle_id, 
        mj.open_date AS start_date, 
        mj.close_date, 
        mj.job_status, 
        mj.total_cost_vnd,
        GROUP_CONCAT(DISTINCT m.full_name SEPARATOR ', ') AS mechanics_assigned
      FROM maintenance_job mj
      LEFT JOIN maintenance_activity ma ON mj.job_id = ma.job_id
      LEFT JOIN activity_assignment aa ON ma.activity_id = aa.activity_id
      LEFT JOIN mechanic m ON aa.mechanic_id = m.mechanic_id
      WHERE 1=1
    `;
    const values: any[] = [];
    
    if (filters.vehicle_id) { 
      query += ` AND mj.vehicle_id = ?`; 
      values.push(filters.vehicle_id); 
    }

    if (filters.mechanic_id) {
      query += ` AND aa.mechanic_id = ?`;
      values.push(filters.mechanic_id);
    }

    if (filters.startDate) {
      query += ` AND mj.open_date >= ?`;
      values.push(`${filters.startDate} 00:00:00`);
    }

    query += ` GROUP BY mj.job_id ORDER BY mj.open_date DESC LIMIT 500;`;

    const [rows] = await pool.query(query, values);
    return rows as any[];
  } catch (error) {
    return [];
  }
}

// 4. Update Maintenance Job Status Safely
export async function updateMaintenanceJob(job_id: string, new_status: string, close_date?: string) {
  try {
    const query = `
      UPDATE maintenance_job 
      SET job_status = ?, close_date = ? 
      WHERE job_id = ?
    `;
    await pool.query(query, [new_status, close_date || null, job_id]);
  } catch (error) {}
}