"use server";

import prisma from "@/lib/prisma";
import { Game } from "@prisma/client";

export async function GetGames() {
  return await prisma.game.findMany({
    include: {
      _count: { select: { players: { where: { attendant: true } } } },
    },
  });
}

export async function UpdateGame(game: Game) {
  try {
    if (!game.name || game.name.length == 0) return "Name is not valid!";
    if (game.rounds < 1) return "Rounds is not valid!";
    await prisma.game.update({
      where: { id: game.id },
      data: {
        name: game.name,
        description: game.description,
        rounds: game.rounds,
      },
    });
    return null;
  } catch (error) {
    console.log(error);
    return "Failed to update game";
  }
}

export async function DeleteGame(gameId: number): Promise<string | null> {
  try {
    await prisma.game.delete({ where: { id: gameId } });
    return null;
  } catch (error) {
    console.log(error);
    return "Failed to delete game";
  }
}

export async function CreateGame(formData: FormData): Promise<string | null> {
  const name = formData.get("name")?.toString();
  const rounds = Number.parseInt(formData.get("rounds")?.toString() ?? "-1");
  const description = formData.get("description")?.toString() ?? null;

  if (!name || name?.length == 0) return "Name is not valid!";
  if (rounds < 1) return "Rounds is not valid!";

  try {
    await prisma.game.create({ data: { name, rounds, description } });
    return null;
  } catch (error) {
    console.log(error);
    return "Failed to create game";
  }
}
