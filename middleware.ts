import { NextRequest, NextResponse } from "next/server";
import prisma from "./lib/prisma";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("KhFSS")?.value;
  if (token) {
    const found = await prisma.session.findFirst({ where: { token: token } });
    if (
      found &&
      (Date.now() - found.creation_date.getDate()) * 1000 * 60 * 60 * 24 <= 3
    ) {
      const response = NextResponse.next();
      response.cookies.set("user", found.user_id.toString());
      return response;
    }
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/(private.*)"],
};
