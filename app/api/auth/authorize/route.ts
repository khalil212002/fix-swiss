import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const json = await req.json();

  if (json.secret == process.env.TOTP_SECRET) {
    const found = await prisma.session.findFirst({
      where: { token: json.token },
    });

    if (
      found &&
      (Date.now() - found.creation_date.getTime()) / (1000 * 3600 * 24) <= 3
    ) {
      return NextResponse.json({ userId: found.user_id });
    }
  }
  return NextResponse.json({ userId: null });
}
