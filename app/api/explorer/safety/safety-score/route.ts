import { NextRequest, NextResponse } from "next/server";

import {
  searchSafetyScoresService,
} from "@/services/explorer/safety";

export async function POST(
  request: NextRequest
) {

  try {

    const filters =
      await request.json();

    const data =
      await searchSafetyScoresService(
        filters
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Unable to search safety scores.",
      },
      {
        status: 500,
      }
    );

  }

}