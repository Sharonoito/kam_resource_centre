import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const SESSION_COOKIES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.callback-url",
  "__Secure-next-auth.callback-url",
  "next-auth.csrf-token",
  "__Host-next-auth.csrf-token",
]

function clearAuthCookies(response: NextResponse) {
  for (const cookieName of SESSION_COOKIES) {
    response.cookies.delete(cookieName)
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = Boolean(token)
  const role = (token?.role as string | undefined) ?? "PUBLIC"
  const accessTier = (token?.accessTier as string | undefined) ?? "PUBLIC_FREE_ONLY"
  const isAdmin = role === "SUPERADMIN" || role === "ADMIN"

  // Single-session enforcement: if JWT was flagged as stale, force sign-out.
  if (token?.forceLogout) {
    const logoutUrl = new URL("/api/auth/signout", req.url)
    logoutUrl.searchParams.set("callbackUrl", "/")
    logoutUrl.searchParams.set("session_conflict", "1")

    const response = NextResponse.redirect(logoutUrl)
    clearAuthCookies(response)
    return response
  }

  // Admins land in dashboard after authentication.
  if (isAuthenticated && isAdmin && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  // Protect admin routes.
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  // Public users without subscription cannot access member library.
  if (pathname.startsWith("/member")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/api/auth/signin", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (accessTier === "PUBLIC_FREE_ONLY") {
      const deniedUrl = new URL("/unauthorized", req.url)
      deniedUrl.searchParams.set("reason", "subscription_required")
      return NextResponse.redirect(deniedUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
