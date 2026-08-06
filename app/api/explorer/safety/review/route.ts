import { NextRequest, NextResponse } from "next/server";

import {
  saveIncidentReview,
} from "@/services/explorer/safety";

export async function PATCH(
  request: NextRequest
) {
  try {

    const {
      reviewId,
      decision,
      comments,
    } = await request.json();

    await saveIncidentReview(
      reviewId,
      decision,
      comments
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message:
          "Unable to update incident review.",
      },
      {
        status: 500,
      }
    );

  }
}