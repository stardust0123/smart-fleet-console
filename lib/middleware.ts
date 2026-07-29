import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  const protectedRoutes = [
    "/owner",
    "/manager",
    "/driver",
    "/mechanic",
    "/safety",
  ];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/owner/:path*",
    "/manager/:path*",
    "/driver/:path*",
    "/mechanic/:path*",
    "/safety/:path*",
  ],
};