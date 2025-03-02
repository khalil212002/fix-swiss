import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const auth = await authorize(request);
  if (auth) {
    let res;
    if (request.nextUrl.pathname == "/") {
      res = NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (request.nextUrl.pathname == "/auth/logout") {
      res = NextResponse.next();
    } else if (request.nextUrl.pathname.startsWith("/auth/")) {
      res = NextResponse.redirect(new URL("/", request.url));
    } else {
      res = NextResponse.next();
    }
    res.cookies.set("userId", auth, { httpOnly: true });
    return res;
  }

  if (request.nextUrl.pathname == "/auth/login") return NextResponse.next();
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

async function authorize(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get("KhFSS")?.value;

  if (token) {
    const apiRes = await fetch(`${request.nextUrl.origin}/api/auth/authorize`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token, secret: process.env.TOTP_SECRET }),
      method: "POST",
    });

    const json = await apiRes.json();
    if (json && json.userId) return json.userId;
  }

  return null;
}

export const config = {
  matcher: ["/dashboard(.*)", "/", "/auth(.*)"],
};
