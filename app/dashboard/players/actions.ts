"use server";

import prisma from "@/lib/prisma";

export async function addPlayer(form: FormData): Promise<string | null> {
  try {
    const firstName = form.get("firstName")!.toString();
    const lastName = form.get("lastName")!.toString();
    const birthYear = form.get("birthYear")!.toString();
    const rating = form.get("rating")!.toString();
    const attendant = (form.get("attendant")?.toString() ?? "off") == "on";

    const player = await prisma.player.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        birth_year: Number.parseInt(birthYear),
        rating: Number.parseInt(rating),
        attendant: attendant,
      },
    });

    return null;
  } catch (e) {
    console.log(e);

    return "Failed to add player";
  }
}

export async function getAttendantPlayers() {
  return prisma.player.findMany({
    where: { attendant: true },
  });
}

export async function searchPlayer(FormData: FormData) {}
