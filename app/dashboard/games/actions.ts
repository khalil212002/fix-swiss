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
  await prisma.game.update({
    where: { id: game.id },
    data: {
      name: game.name,
      description: game.description,
      rounds: game.rounds,
    },
  });
}

export async function DeleteGame(id: number) {
  try {
    await prisma.game.delete({ where: { id: id } });

    return null;
  } catch (e) {
    console.log((e as Error).message);

    return (e as Error).message;
  }
}

export async function CreateGame(formData: FormData): Promise<string | null> {
  try {
    await prisma.game.create({
      data: {
        name: formData.get("name")!.toString()!,
        rounds: Number.parseInt(formData.get("rounds")!.toString()!),
        description: formData.get("description")?.toString() ?? null,
      },
    });
    return null;
  } catch (e) {
    return (e as Error).message;
  }
}
