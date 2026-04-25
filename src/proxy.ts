import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];
const DASHBOARD_PREFIXES = ["/dashboard", "/admin", "/user"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const isAuthenticated = Boolean(accessToken || refreshToken);

    if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL(pathname.replace("/admin", "/dashboard"), request.url));
    }

    if (pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL(pathname.replace("/user", "/dashboard"), request.url));
    }

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    const isDashboardRoute = DASHBOARD_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

    if (!isAuthenticated && isDashboardRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthenticated && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/user/:path*", "/login", "/register", "/forgot-password", "/reset-password"],
};
