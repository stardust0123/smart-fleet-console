import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AvailableMechanicsTable from "@/components/tables/AvailableMechanicsTable";
import ActiveJobsTable from "@/components/tables/ActiveJobsTable";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";

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

      <div className="mt-6 space-y-6">
        <AvailableMechanicsTable data={availableMechanics as any[]} />
        <ActiveJobsTable
          data={jobs as any[]}
          allMechanics={allMechanics as any[]}
          onSubmit={updateJobAndAssign}
        />
      </div>
    </>
  );
}