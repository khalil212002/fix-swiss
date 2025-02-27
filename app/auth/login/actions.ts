"use server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function login(
  prevState: string,
  formData: FormData
): Promise<string> {
  const cookieStore = await cookies();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const found = await prisma.user.findFirst({
    where: {
      AND: [{ username: username }, { password: password }],
    },
  });
  if (found) {
    redirect("/");
  } else {
    return "Failed to login!";
  }
}
