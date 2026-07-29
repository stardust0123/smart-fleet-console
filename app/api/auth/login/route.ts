import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    // Temporary password comparison
    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const token = await signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    });

    const response = NextResponse.json({
    success: true,
    user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
    },
    });

    response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}