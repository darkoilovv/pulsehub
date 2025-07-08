import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/auth/login", "/auth/password-recovery"]

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get("jwt")?.value
  const pathname = request.nextUrl.pathname
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  if (!jwt && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (jwt && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Optional: Validate JWT here
  return NextResponse.next()
}

// export const config = {
// }

export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|api/|logo.png).*)",
  ],
}
