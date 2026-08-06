import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth";
import { signToken } from "@/lib/jwt";
import pool from "@/lib/db";
import { hashPassword, isBcryptHash, verifyPassword } from "@/lib/password";

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

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
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

    if (!isBcryptHash(user.password)) {
      const hashedPassword = await hashPassword(password);
      await pool.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]);
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
    maxAge: 60 * 60 * 24, // 1 day
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