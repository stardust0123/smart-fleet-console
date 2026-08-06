import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import { Wrench, CheckCircle } from "lucide-react";

const safeFetch = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
  try { return await promise; } catch (error) { return fallback; }
};

// SERVER ACTION: Update Job and Assign Mechanic with ultra-safe DB logic
async function updateJobAndAssign(formData: FormData) {
  "use server";
  const job_id = formData.get("job_id") as string;
  const new_status = formData.get("status") as string;
  const mechanic_id = formData.get("mechanic_id") as string;
  let activity_id = formData.get("activity_id") as string;
  
  const isClosing = new_status === "CLOSED" || new_status === "COMPLETED" || new_status === "Completed";
  const close_date = isClosing ? new Date().toISOString().split('T')[0] : null;

  try {
    // 1. UPDATE JOB STATUS (Fix: Only update close_date if it's actually closing to avoid NULL error)
    if (new_status) {
      if (isClosing) {
        await pool.query(
          `UPDATE maintenance_job SET job_status = ?, close_date = ? WHERE job_id = ?`,
          [new_status, close_date, job_id]
        );
      } else {
        await pool.query(
          `UPDATE maintenance_job SET job_status = ? WHERE job_id = ?`,
          [new_status, job_id]
        );
      }
    }

    // 2. ASSIGN MECHANIC SAFELY (Fix: labour_hours default value & Duplicate Key)
    if (mechanic_id && mechanic_id !== "") {
      
      // Get or Create Activity
      if (!activity_id || activity_id === 'null' || activity_id === '') {
        const [existingActs]: any = await pool.query(
          `SELECT activity_id FROM maintenance_activity WHERE job_id = ? ORDER BY activity_id DESC LIMIT 1`, 
          [job_id]
        );
        
        if (existingActs && existingActs.length > 0) {
          activity_id = existingActs[0].activity_id;
        } else {
          const generatedActId = `ACT${Math.floor(Math.random() * 100000)}`;
          await pool.query(
            `INSERT INTO maintenance_activity (activity_id, job_id, activity_name) VALUES (?, ?, 'General Maintenance')`,
            [generatedActId, job_id]
          );
          activity_id = generatedActId;
        }
      }

      // Assign Mechanic
      if (activity_id) {
        // Step A: Remove old assignment to prevent Duplicate Entry Primary Key Error
        await pool.query(`DELETE FROM activity_assignment WHERE activity_id = ?`, [activity_id]);
        
        // Step B: Insert new assignment and provide labour_hours = 0 to prevent ER_NO_DEFAULT_FOR_FIELD
        await pool.query(
          `INSERT INTO activity_assignment (activity_id, mechanic_id, labour_hours) VALUES (?, ?, 0)`, 
          [activity_id, mechanic_id]
        );
      }
    }

    revalidatePath("/manager/job-allocation", "page");
    revalidatePath("/manager", "page");

  } catch (error) {
    console.error(">>> FAILED TO SAVE JOB/ASSIGNMENT <<< : ", error);
  }
}

export default async function JobAllocationPage() {
  // Fetch idle mechanics
  let availableMechanics: RowDataPacket[] = [];
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT m.mechanic_id, m.full_name, d.depot_name 
      FROM mechanic m
      LEFT JOIN workshop w ON m.workshop_id = w.workshop_id
      LEFT JOIN depot d ON w.depot_code = d.depot_code
      WHERE NOT EXISTS (
        SELECT 1 FROM activity_assignment aa
        JOIN maintenance_activity ma ON aa.activity_id = ma.activity_id
        JOIN maintenance_job mj ON ma.job_id = mj.job_id
        WHERE aa.mechanic_id = m.mechanic_id AND mj.job_status NOT IN ('CLOSED', 'COMPLETED', 'Completed')
      )
    `);
    availableMechanics = rows;
  } catch (error) {
    availableMechanics = [];
  }

  // Fetch all mechanics for dropdown
  const allMechanics = await safeFetch(
    pool.query<RowDataPacket[]>(`SELECT mechanic_id, full_name FROM mechanic`).then(res => res[0]),
    []
  );

  // Fetch active maintenance jobs WITH Vehicle Model and current Assignment
  let jobs: RowDataPacket[] = [];
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        mj.job_id, mj.vehicle_id, mj.open_date, mj.job_status, 
        v.register_number, v.model, d.depot_name,
        (SELECT activity_id FROM maintenance_activity WHERE job_id = mj.job_id ORDER BY activity_id DESC LIMIT 1) as activity_id,
        (
          SELECT mechanic_id FROM activity_assignment 
          WHERE activity_id = (SELECT activity_id FROM maintenance_activity WHERE job_id = mj.job_id ORDER BY activity_id DESC LIMIT 1) 
          LIMIT 1
        ) as assigned_mechanic_id
      FROM maintenance_job mj
      JOIN vehicle v ON mj.vehicle_id = v.vehicle_id
      LEFT JOIN depot d ON v.depot_code = d.depot_code
      WHERE mj.job_status NOT IN ('CLOSED', 'COMPLETED', 'Completed') OR mj.close_date IS NULL
      ORDER BY mj.open_date DESC
    `);
    jobs = rows;
  } catch (error) {
    jobs = [];
  }

  return (
    <>
      <DashboardHeader 
        title="Job Management & Allocation" 
        description="Review active maintenance jobs, assign mechanics directly, and update statuses."
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-6 overflow-hidden">
        <div className="p-4 border-b bg-green-50/50 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-green-800">Available Mechanics (Idle)</h3>
        </div>
        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-600 sticky top-0">
              <tr>
                <th className="px-4 py-3">Mechanic ID</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Depot Location</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {availableMechanics && availableMechanics.length > 0 ? (
                availableMechanics.map((mech) => (
                  <tr key={mech.mechanic_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{mech.mechanic_id}</td>
                    <td className="px-4 py-3 text-gray-700">{mech.full_name}</td>
                    <td className="px-4 py-3 text-gray-600 font-medium">{mech.depot_name || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium border border-green-200">
                        Ready for Assignment
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">All mechanics are currently busy.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-8 overflow-hidden mb-8">
        <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-800">Active Maintenance Jobs & Allocation</h3>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="px-4 py-3">Job ID</th>
                <th className="px-4 py-3">Vehicle & Model</th>
                <th className="px-4 py-3">Vehicle Depot</th>
                <th className="px-4 py-3">Open Date</th>
                <th className="px-4 py-3">Current Status</th>
                <th className="px-4 py-3 text-right">Assign & Update Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.job_id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{job.job_id}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <span className="font-semibold">{job.register_number}</span> 
                      <span className="text-gray-500 text-xs ml-1 block">{job.model || 'Unknown Model'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md text-xs border border-indigo-100">
                        {job.depot_name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{new Date(job.open_date).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-md font-medium border
                        ${job.job_status === 'OPEN' || job.job_status === 'Pending' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          job.job_status === 'IN_PROGRESS' || job.job_status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {job.job_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <form action={updateJobAndAssign} className="flex justify-end gap-2 items-center">
                        <input type="hidden" name="job_id" value={job.job_id} />
                        <input type="hidden" name="activity_id" value={job.activity_id || ''} />
                        <select 
                          name="mechanic_id" 
                          defaultValue={job.assigned_mechanic_id || ""} 
                          className="border border-gray-300 p-1.5 rounded-md bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-36"
                        >
                          <option value="">-- Unassigned --</option>
                          {allMechanics?.map((mech: any) => (
                            <option key={mech.mechanic_id} value={mech.mechanic_id}>{mech.full_name}</option>
                          ))}
                        </select>
                        <select 
                          name="status" 
                          defaultValue={job.job_status} 
                          className="border border-gray-300 p-1.5 rounded-md bg-white text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No active maintenance jobs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}