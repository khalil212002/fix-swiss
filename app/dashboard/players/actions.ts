"use server";

import prisma from "@/lib/prisma";
import { Player } from "@prisma/client";

export async function addPlayer(form: FormData): Promise<string | null> {
  try {
    const firstName = form.get("firstName")?.toString();
    const lastName = form.get("lastName")?.toString();
    const birthYear = Number.parseInt(
      form.get("birthYear")?.toString() ?? "-1"
    );
    const rating = Number.parseInt(form.get("rating")?.toString() ?? "-1");
    const attendant = (form.get("attendant")?.toString() ?? "off") == "on";
    const game: number | null = Number.parseInt(
      form.get("game")?.toString() ?? "-1"
    );

    if (game == -1) return "Game is not valid!";
    if (!firstName || firstName?.length == 0) return "First name is not valid!";
    if (!lastName || lastName?.length == 0) return "Last name is not valid!";
    if (birthYear < 1900 || birthYear > new Date().getFullYear()) {
      return "Birth year is not valid!";
    }
    if (rating < 1200 || rating > 3000) return "Rating is not valid!";

    await prisma.player.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        birth_year: birthYear,
        rating: rating,
        attendant: attendant,
        game_id: game,
      },
    });

    return null;
  } catch (error) {
    console.log(error);
    return "Failed to add player";
  }
}

export async function updatePlayer(
  data: Partial<Player>
): Promise<string | null> {
  if (!data.first_name || data.first_name?.length == 0)
    return "First name is not valid!";
  if (!data.last_name || data.last_name?.length == 0)
    return "Last name is not valid!";
  if (
    !data.birth_year ||
    data.birth_year < 1900 ||
    data.birth_year > new Date().getFullYear()
  ) {
    return "Birth year is not valid!";
  }
  if (!data.rating || data.rating < 1200 || data.rating > 3000)
    return "Rating is not valid!";

  try {
    await prisma.player.update({
      where: { id: data.id },
      data: { ...data, game_id: data.game_id == -1 ? null : data.game_id },
    });
    return null;
  } catch (e) {
    console.log(e);
    return "Failed to update player";
  }
}

export async function deletePlayer(id: number) {
  try {
    await prisma.player.delete({ where: { id: id } });
    return null;
  } catch (error) {
    console.log(error);
    return "Failed to delete player";
  }
}

export async function GetGamesList() {
  return await prisma.game.findMany({ select: { id: true, name: true } });
}

export async function searchPlayer(
  FormData: FormData | null
): Promise<Partial<Player>[]> {
  try {
    const fname = (FormData?.get("firstName") ?? "").toString() + "%";
    const lname = (FormData?.get("lastName") ?? "").toString() + "%";
    const bYear = (FormData?.get("birthYear") ?? "").toString() + "%";
    const game = Number.parseInt(FormData?.get("game")?.toString() ?? "-1");

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

    return await prisma.$queryRaw`SELECT attendant, birth_year, first_name, last_name, rating, id, game_id 
    FROM player ORDER BY CASE WHEN 
    (first_name LIKE ${fname} AND last_name LIKE ${lname} AND birth_year LIKE ${bYear}) THEN 0
    ELSE 1 END, attendant desc`;
  } catch {
    return [];
  }
}
