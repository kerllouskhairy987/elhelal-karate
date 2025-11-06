import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./utils/verifyToken";

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("JwtToken")?.value || "";

  const user = verifyToken(token);

  const { pathname } = request.nextUrl;

  if (!token || !user) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/trainer", "/trainer/:path*"],
};
