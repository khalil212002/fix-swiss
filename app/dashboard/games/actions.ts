"use server";

import prisma from "@/lib/prisma";

export async function GetGames() {
  const games = await prisma.game.findMany();
  let final: Game[] = [];
  for (let i = 0; i < games.length; i++) {
    final.push({
      ...games[i],
      player_count: await prisma.player.count({ where: { id: games[i].id } }),
    });
  }

  console.log(final);

  return final;
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
