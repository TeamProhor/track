import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/session";

// In Next.js 16 proxy.ts acts as the interceptor
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtected =
    path.startsWith("/dashboard") || path.startsWith("/admin");
  const isAuthRoute =
    path.startsWith("/sign-in") || path.startsWith("/sign-up");

  const session = await getSession();

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
