"use server";

import prisma from "@/lib/prisma";

export async function addPlayer(form: FormData): Promise<string | null> {
  try {
    const firstName = form.get("firstName")!.toString();
    const lastName = form.get("lastName")!.toString();
    const birthYear = form.get("birthYear")!.toString();
    const rating = form.get("rating")!.toString();
    const attendant = (form.get("attendant")?.toString() ?? "off") == "on";
    let game: number | null = Number.parseInt(form.get("game")!.toString());
    if (game == -1) game = null;

    await prisma.player.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        birth_year: Number.parseInt(birthYear),
        rating: Number.parseInt(rating),
        attendant: attendant,
        game_id: game,
      },
    });

    return null;
  } catch (e) {
    console.log(e);

    return "Failed to add player";
  }
}

export async function updatePlayer(data: Player) {
  await prisma.player.update({
    where: { id: data.id },
    data: { ...data, game_id: data.game_id == -1 ? null : data.game_id },
  });
}

export async function deletePlayer(id: number) {
  await prisma.player.delete({ where: { id: id } });
}

export async function GetGamesList() {
  return await prisma.game.findMany({ select: { id: true, name: true } });
}

export async function searchPlayer(
  FormData: FormData | null
): Promise<Player[]> {
  try {
    const fname = (FormData?.get("firstName") ?? "").toString() + "%";
    const lname = (FormData?.get("lastName") ?? "").toString() + "%";
    const bYear = (FormData?.get("birthYear") ?? "").toString() + "%";
    const game = Number.parseInt(FormData?.get("game")?.toString()!);

    if (!Number.isNaN(game) && game != -1) {
      return await prisma.player.findMany({
        select: {
          attendant: true,
          birth_year: true,
          first_name: true,
          last_name: true,
          rating: true,
          id: true,
          game_id: true,
        },
        orderBy: { attendant: "desc" },
        where: { game_id: game },
      });
    }

    if (fname?.length == 1 && lname?.length == 1 && bYear?.length == 1) {
      return await prisma.player.findMany({
        select: {
          attendant: true,
          birth_year: true,
          first_name: true,
          last_name: true,
          rating: true,
          id: true,
          game_id: true,
        },
        orderBy: { attendant: "desc" },
      });
    }

    console.log("hii");

    return await prisma.$queryRaw`SELECT attendant, birth_year, first_name, last_name, rating, id, game_id 
    FROM player ORDER BY CASE WHEN 
    (first_name LIKE ${fname} AND last_name LIKE ${lname} AND birth_year LIKE ${bYear}) THEN 0
    ELSE 1 END, attendant desc`;
  } catch {
    return [];
  }
}
