"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  prisma.session.delete({ where: { token: cookieStore.get("KhFSS")?.value } });
  cookieStore.delete("KhFSS");
  redirect("/");
}
