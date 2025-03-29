"use client";

import { useEffect, useState } from "react";
import { GetGames } from "../games/actions";
import { UnPairing, GetMatches, Pair } from "./actions";
import { Match, Game } from "@prisma/client";
import MatchesList from "./MatchesList";

export default function MatchesPage() {
  const [games, setGames] = useState<
    (Game & { _count: { players: number } })[]
  >([]);
  const [game, setGame] = useState<
    (Game & { _count: { players: number } }) | null
  >(null);
  const [refreshGameList, setRefreshGameList] = useState(false);
  const [round, setRound] = useState(1);
  const [matches, setMatches] = useState<Match[]>([]);
  const [refreshMatchesList, setRefreshMatchesList] = useState(false);
  useEffect(() => {
    GetGames().then((v) => {
      setGames(v);
    });
  }, [refreshGameList]);
  useEffect(() => {
    if (game?.id)
      GetMatches(game.id, round).then((v) => {
        setMatches(v);
      });
    else setMatches([]);
  }, [game, round, refreshMatchesList]);

  async function pair() {
    await Pair(game!.id!);
    setRefreshMatchesList(!refreshMatchesList);
  }

  async function unPair() {
    if (game) {
      await UnPairing(game?.id);
      setRefreshMatchesList(!refreshMatchesList);
    }
  }

  return (
    <>
      <div className="flex m-5 text-xl">
        <h3 className="text-nowrap  mt-1 mx-2">Select Game:</h3>
        <select
          className="select select-primary"
          onChange={(e) => {
            setGame(
              games.find((g) => g.id?.toString() == e.target.value) ?? null
            );
            setRound(1);
          }}
          onClick={() => setRefreshGameList(!refreshGameList)}
        >
          <option selected value={-1}>
            Select Game
          </option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        {game && (
          <>
            <h3 className="mt-1 ms-10 text-nowrap">
              Players: {game?._count.players}
            </h3>
            <h3 className="mt-1 ms-10 text-nowrap">
              Rounds: {round}/{game?.rounds}
            </h3>
            <h3 className="mt-1 ms-10 text-nowrap">
              Description: {game?.description}
            </h3>
          </>
        )}
      </div>
      {game && (
        <>
          <div>
            <button
              className="btn mx-1 btn-secondary"
              disabled={round == 1}
              onClick={() => setRound(round - 1)}
            >
              Previous
            </button>
            {matches.length == 0 ? (
              <button className="btn mx-1 btn-primary btn-lg" onClick={pair}>
                Pair
              </button>
            ) : (
              <button className="btn mx-1 btn-error btn-lg" onClick={unPair}>
                Unpair
              </button>
            )}
            <button
              className="btn mx-1 btn-secondary"
              disabled={round == game.rounds || matches.length == 0}
              onClick={() => setRound(round + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
      {matches.length > 0 && (
        <MatchesList
          matches={matches}
          refreshMatchesList={() => setRefreshMatchesList(!refreshMatchesList)}
        />
      )}
    </>
  );
}
