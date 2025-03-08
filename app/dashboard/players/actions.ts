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

export async function searchPlayer(FormData: FormData | null) {
  let found: any[];
  try {
    const birthYear = FormData?.get("birthYear")?.toString() ?? "";
    if (birthYear.length > 0) {
      found = await prisma.player.findMany({
        select: {
          attendant: true,
          birth_year: true,
          first_name: true,
          last_name: true,
          rating: true,
          id: true,
        },
        where: {
          first_name: {
            startsWith: FormData?.get("firstName")?.toString() ?? "",
          },
          AND: {
            last_name: {
              startsWith: FormData?.get("lastName")?.toString() ?? "",
            },
            AND: {
              birth_year: Number.parseInt(birthYear),
            },
          },
        },
      });
    } else {
      found = await prisma.player.findMany({
        where: {
          first_name: {
            startsWith: FormData?.get("firstName")?.toString() ?? "",
          },
          AND: {
            last_name: {
              startsWith: FormData?.get("lastName")?.toString() ?? "",
            },
          },
        },
        orderBy: { attendant: "desc" },
      });
    }
  } catch {
    found = [];
  }

  return found;
}
