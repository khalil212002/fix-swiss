"use server";

import prisma from "@/lib/prisma";
import { Match } from "@prisma/client";
import { Swiss } from "tournament-pairings";

export async function Pair(game: number, round: number) {
  const players = await prisma.player.findMany({
    where: { attendant: true, AND: { game_id: game } },
    select: {
      id: true,
      rating: true,
      black_matches: { select: { player1: true, winner: true, round: true } },
      white_matches: { select: { player2: true, winner: true, round: true } },
    },
  });

  const matches = Swiss(
    players.map((v) => {
      return {
        ...v,
        receivedBye: v.white_matches.some((match) => match.player2 == null),
        avoid: v.white_matches
          .map((match) => match.player2)
          .concat(v.black_matches.map((match) => match.player1))
          .filter((player) => player != null),
        score:
          v.white_matches.filter((match) => match.winner == 1).length +
          v.white_matches.filter((match) => match.winner == 0).length * 0.5 +
          v.black_matches.filter((match) => match.winner == -1).length +
          v.black_matches.filter((match) => match.winner == 0).length * 0.5,
        seating: v.black_matches
          .map((match) => {
            return { round: match.round, value: -1 };
          })
          .concat(
            v.white_matches.map((match) => {
              return { round: match.round, value: 1 };
            })
          )
          .sort((a, b) => a.round - b.round)
          .map((v) => v.value) as Array<1 | -1>,
      };
    }),
    round,
    round == 1,
    true
  );

  await prisma.match.createMany({
    data: matches.map((m) => {
      return { game_id: game, ...m } as Match;
    }),
  });
}

export async function DeletePairing(gameId: number) {
  await prisma.$transaction(async (tx) => {
    const count = await tx.match.findFirst({
      select: { round: true },
      where: { game_id: gameId },
      orderBy: { round: "desc" },
    });
    await tx.match.deleteMany({
      where: { game_id: gameId, round: count?.round },
    });
  });
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
