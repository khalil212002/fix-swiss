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

export async function updatePlayer(
  id: number,
  data: {
    attendant?: boolean;
    birth_year?: number;
    first_name?: string;
    last_name?: string;
    rating?: number;
  }
) {
  await prisma.player.update({ where: { id: id }, data: data });
}

export async function searchPlayer(FormData: FormData | null): Promise<
  {
    rating: number;
    attendant: boolean;
    id: number;
    birth_year: number;
    first_name: string;
    last_name: string;
  }[]
> {
  try {
    let fname = FormData?.get("firstName")?.toString() + "%";
    let lname = FormData?.get("lastName")?.toString() + "%";
    let bYear = FormData?.get("birthYear")?.toString() + "%";

    if (fname?.length == 1 && lname?.length == 1 && bYear?.length == 1) {
      return await prisma.player.findMany({
        select: {
          attendant: true,
          birth_year: true,
          first_name: true,
          last_name: true,
          rating: true,
          id: true,
        },
        orderBy: { attendant: "desc" },
      });
    }

    return await prisma.$queryRaw`SELECT attendant, birth_year, first_name, last_name, rating, id 
    FROM player ORDER BY CASE WHEN 
    (first_name LIKE ${fname} AND last_name LIKE ${lname} AND birth_year LIKE ${bYear}) THEN 0
    ELSE 1 END, attendant desc`;
  } catch {
    return [];
  }
}
