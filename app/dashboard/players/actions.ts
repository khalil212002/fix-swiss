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
    let fname = FormData?.get("firstName")?.toString();
    let lname = FormData?.get("lastName")?.toString();
    let bYear = FormData?.get("birthYear")?.toString();
    let filter = false;

    if ((fname?.length ?? 0) > 0) {
      fname += "%";
      filter = true;
    }
    if ((lname?.length ?? 0) > 0) {
      lname += "%";
      filter = true;
    }
    if ((bYear?.length ?? 0) > 0) {
      bYear += "%";
      filter = true;
    }
    if (!filter) {
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
    (first_name LIKE ${fname} OR last_name LIKE ${lname} OR birth_year LIKE ${bYear}) THEN 0
    ELSE 1 END, attendant desc`;
  } catch {
    return [];
  }
}
