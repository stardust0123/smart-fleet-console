import { NextResponse } from "next/server";
import { loadManagerDashboard } from "@/services/dashboard/manager";

export async function GET() {
  try {
    const stats = await loadManagerDashboard();

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load dashboard statistics.",
      },
      {
        status: 500,
      }
    );
  }
}