"use client";

import { useEffect, useState } from "react";
import { GetGames } from "../games/actions";
import { UnPairing, GetMatches, Pair } from "./actions";
import { Match, Game } from "@prisma/client";
import MatchesList from "./MatchesList";

export default function MatchesPage() {
  const [games, setGames] = useState<{ game: Game; player_count: number }[]>(
    []
  );
  const [game, setGame] = useState<{ game: Game; player_count: number } | null>(
    null
  );
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
    if (game?.game.id)
      GetMatches(game.game.id, round).then((v) => {
        setMatches(v);
      });
    else setMatches([]);
  }, [game, round, refreshMatchesList]);

  async function pair() {
    await Pair(game!.game.id!);
    setRefreshMatchesList(!refreshMatchesList);
  }

  async function unPair() {
    if (game) {
      await UnPairing(game?.game.id);
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
              games.find((g) => g.game.id?.toString() == e.target.value) ?? null
            );
            setRound(1);
          }}
          onClick={() => setRefreshGameList(!refreshGameList)}
        >
          <option selected value={-1}>
            Select Game
          </option>
          {games.map((g) => (
            <option key={g.game.id} value={g.game.id}>
              {g.game.name}
            </option>
          ))}
        </select>
        {game && (
          <>
            <h3 className="mt-1 ms-10 text-nowrap">
              Players: {game?.player_count}
            </h3>
            <h3 className="mt-1 ms-10 text-nowrap">
              Rounds: {round}/{game?.game.rounds}
            </h3>
            <h3 className="mt-1 ms-10 text-nowrap">
              Description: {game?.game.description}
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
              disabled={round == game.game.rounds || matches.length == 0}
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
