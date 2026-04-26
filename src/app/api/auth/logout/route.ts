import { NextRequest, NextResponse } from "next/server";

const COOKIES_TO_CLEAR = [
  "accessToken",
  "refreshToken",
  "better-auth.session_token",
  "better-auth.csrf_token",
];

const clearAuthCookies = (response: NextResponse) => {
  COOKIES_TO_CLEAR.forEach((name) => {
    response.cookies.set({
      name,
      value: "",
      expires: new Date(0),
      path: "/",
    });
  });
};

async function callBackendLogout(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return;

  try {
    await fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: request.headers.get("cookie") || "",
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch {
    // Even if backend logout fails, frontend cookies should still be cleared.
  }
}

export async function GET(request: NextRequest) {
  await callBackendLogout(request);
  const response = NextResponse.redirect(new URL("/", request.url));
  clearAuthCookies(response);
  return response;
}

export async function POST(request: NextRequest) {
  await callBackendLogout(request);
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  clearAuthCookies(response);
  return response;
}
