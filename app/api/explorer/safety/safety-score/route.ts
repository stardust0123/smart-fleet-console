import { NextRequest, NextResponse } from "next/server";

import {
  searchSafetyScores,
} from "@/services/explorer/safety";

export async function POST(
  request: NextRequest
) {
  try {
    const filters = await request.json();

    const rows =
      await searchSafetyScores(filters);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Unable to load safety scores.",
      },
      {
        status: 500,
      }
    );
  }
}