"use server";

import prisma from "@/lib/prisma";

export async function GetResults(gameId: number) {
  const players = await prisma.player.findMany({
    where: { attendant: true, game_id: gameId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      black_matches: {
        select: { player1: true, winner: true },
        where: { game_id: gameId },
      },
      white_matches: {
        select: { player2: true, winner: true },
        where: { game_id: gameId },
      },
    },
  });
  const playerWScore = new Map<
    number,
    (typeof players)[0] & { score: number }
  >();

  players.forEach((p) => {
    playerWScore.set(p.id, {
      ...p,
      score:
        p.white_matches.filter((m) => m.winner == 1 || m.player2 == null)
          .length +
        p.white_matches.filter((m) => m.winner == 0).length * 0.5 +
        p.black_matches.filter((m) => m.winner == -1).length +
        p.black_matches.filter((m) => m.winner == 0).length * 0.5,
    });
  });
  const result: Array<{ name: string; score: number; SB_score: number }> = [];
  playerWScore.keys().forEach((v) => {
    const r = playerWScore.get(v);
    if (r)
      result.push({
        name: r.first_name + " " + r?.last_name,
        score: r.score,
        SB_score:
          r.score +
          r.black_matches
            .filter((m) => m.winner != 1 && m.player1 != null)
            .map((m) =>
              m.winner == -1
                ? playerWScore.get(m.player1!)!.score
                : playerWScore.get(m.player1!)!.score * 0.5
            )
            .reduce((a, b) => a + b, 0) +
          r.white_matches
            .filter((m) => m.player2 != null && m.winner != -1)
            .map((m) =>
              m.winner == 1
                ? playerWScore.get(m.player2!)!.score
                : playerWScore.get(m.player2!)!.score * 0.5
            )
            .reduce((a, b) => a + b, 0),
      });
  });
  result.sort((a, b) =>
    a.score == b.score ? b.SB_score - a.SB_score : b.score - a.score
  );
  return result;
}
