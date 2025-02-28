"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, createHmac } from "crypto";

export default async function login(
  prevState: string,
  formData: FormData
): Promise<string> {
  const username = formData.get("username")?.toString().toLowerCase();
  const password = formData.get("password")?.toString() ?? "";
  const foundUser = await prisma.user.findFirst({
    where: {
      AND: [
        { username: username },
        {
          password: createHmac("sha256", process.env.HMAC_SALT!.toString())
            .update(password)
            .digest("base64"),
        },
      ],
    },
  });
  if (foundUser) {
    const token = randomBytes(64).toString("base64");
    await prisma.session.create({
      data: { token: token, user_id: foundUser.id },
    });
    const cookieStore = await cookies();
    cookieStore.set("KhFSS", token, {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    });
    redirect("/");
  } else {
    return "Failed to login!";
  }
}
