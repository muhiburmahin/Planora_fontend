import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAMES = [
    "accessToken",
    "token",
    "session",
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
];

function getCookieToken(request: NextRequest): string | undefined {
    for (const name of AUTH_COOKIE_NAMES) {
        const val = request.cookies.get(name)?.value;
        if (val) return val;
    }
    return undefined;
}

async function getUserRole(request: NextRequest): Promise<string | null> {
    const token = getCookieToken(request);
    if (!token) return null;

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return null;

        const cookieHeader = request.headers.get("cookie") || "";
        const res = await fetch(`${apiUrl}/users/me`, {
            method: "GET",
            headers: {
                Cookie: cookieHeader,
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) return null;
        const json = await res.json();
        return json?.data?.role ?? json?.role ?? null;
    } catch {
        return null;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAdminPath = pathname === "/admin-dashboard" || pathname.startsWith("/admin-dashboard/");
    const isUserPath = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isProtected = isAdminPath || isUserPath;

    const token = getCookieToken(request);

    // No token → trying protected route → send to login
    if (!token && isProtected) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // No token → public page (login/register/home) → allow
    if (!token) {
        return NextResponse.next();
    }

    // Has token → fetch role from backend
    const role = await getUserRole(request);

    // Invalid/expired token on protected route → send to login
    if (!role && isProtected) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        AUTH_COOKIE_NAMES.forEach((name) => response.cookies.delete(name));
        return response;
    }

    // Logged in → visiting login/register → redirect to their dashboard
    if (role && isAuthPage) {
        if (role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin-dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Admin trying USER dashboard → redirect to admin
    if (role === "ADMIN" && isUserPath) {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }

    // Regular user trying admin paths → redirect to user dashboard
    if (role === "USER" && isAdminPath) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin-dashboard/:path*",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
    ],
};