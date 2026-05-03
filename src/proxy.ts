import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

/** Routes that require accessToken or refreshToken */
const PROTECTED_PREFIXES = ["/dashboard", "/admin-dashboard", "/profile"];

function isProtectedPath(pathname: string): boolean {
    return PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
}

function isAuthRoute(pathname: string): boolean {
    return AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
}

/**
 * `/admin` must not use startsWith("/admin") alone — that also matches `/admin-dashboard`
 * and produced redirects like `/dashboard-dashboard`.
 */
function isLegacyAdminPath(pathname: string): boolean {
    return (
        pathname === "/admin" ||
        (pathname.startsWith("/admin/") && !pathname.startsWith("/admin-dashboard"))
    );
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const isAuthenticated = Boolean(accessToken || refreshToken);

    if (isLegacyAdminPath(pathname)) {
        const target =
            pathname === "/admin"
                ? "/admin-dashboard"
                : `/admin-dashboard${pathname.slice("/admin".length)}`;
        return NextResponse.redirect(new URL(target, request.url));
    }

    if (pathname === "/user" || pathname.startsWith("/user/")) {
        const target =
            pathname === "/user" ? "/dashboard" : `/dashboard${pathname.slice("/user".length)}`;
        return NextResponse.redirect(new URL(target, request.url));
    }

    if (!isAuthenticated && isProtectedPath(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthenticated && isAuthRoute(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin-dashboard/:path*",
        "/admin",
        "/admin/:path*",
        "/user",
        "/user/:path*",
        "/profile",
        "/profile/:path*",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
    ],
};
