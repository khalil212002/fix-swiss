import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("KhFSS")?.value;
  if (token) {
    const apiRes = await fetch(`${request.nextUrl.origin}/api/auth/authorize`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
      method: "POST",
    });

    if ((await apiRes.json()).userId) {
      const res = NextResponse.next();
      res.cookies.set("userId", apiRes.toString(), { httpOnly: true });
      return res;
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/(private.*)"],
};
