import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      {
        status: 500,
      }
    );
  }
}