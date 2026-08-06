import { NextRequest, NextResponse } from "next/server";

import { searchExplorer } from "@/services/explorer/safety";

export async function POST(
  request: NextRequest
) {
  try {
    const filters = await request.json();

    const data = await searchExplorer(filters);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to search safety incidents.",
      },
      {
        status: 500,
      }
    );
  }
}