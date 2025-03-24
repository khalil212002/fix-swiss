"use server";

import prisma from "@/lib/prisma";
import { Swiss } from "tournament-pairings";

export async function Pair(game: number, round: number) {
  const players = await prisma.player.findMany({
    where: { attendant: true, AND: { game_id: game } },
    select: {
      id: true,
      score: true,
      seating: true,
      rating: true,
      avoid: true,
      receivedBye: true,
    },
  });
  console.log(players);

  const matches = Swiss(
    players.map((v) => {
      return { ...v, avoid: v.avoid.filter((a) => a != null) };
    }),
    round,
    round == 1,
    true
  );

  await prisma.match.pushMatches(
    matches.map((v) => {
      return {
        game_id: game,
        round: v.round,
        match: v.match,
        player1: v.player1 as number | null,
        player2: v.player2 as number | null,
        winner: null,
      };
    }),
    players
  );
}

export async function DeletePairing(gameId: number) {
  await prisma.match.popMatches(gameId);
}

export async function GetMatches(game: number, round: number) {
  return await prisma.match.findMany({
    where: { game_id: game, AND: { round: round } },
    include: {
      black: { select: { first_name: true, last_name: true } },
      white: { select: { first_name: true, last_name: true } },
    },
  });
}

export async function SetWinner(
  game: number,
  round: number,
  match: number,
  winner: number
) {
  await prisma.match.update({
    where: { id: { game_id: game, match: match, round: round } },
    data: { winner: winner },
  });
}
