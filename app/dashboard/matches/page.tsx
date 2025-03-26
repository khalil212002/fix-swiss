"use client";

import { useEffect, useState } from "react";
import { GetGames } from "../games/actions";
import { UnPairing, GetMatches, Pair, SetWinner } from "./actions";
import { Match, Player, Game } from "@prisma/client";

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
              disabled={round == game.game.rounds}
              onClick={() => setRound(round + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
      {matches.length > 0 && (
        <>
          <ul className="list mt-3 bg-secondary rounded-box shadow-md">
            {matches.map((v) => (
              <li className="flex justify-evenly list-row" key={v.match}>
                <p className=" w-50 my-auto">
                  {"⬜ "}
                  {((v as Match & { white: Player }).white as Player)
                    .first_name +
                    " " +
                    ((v as Match & { white: Player }).white as Player)
                      .last_name}{" "}
                  ({v.player1})
                </p>
                <div className="join">
                  <button
                    className={
                      "btn join-item" +
                      (v.winner == 1 ? " btn-primary" : " btn-soft")
                    }
                    onClick={() =>
                      SetWinner(
                        v.game_id,
                        v.round,
                        v.match,
                        v.winner == 1 ? null : 1
                      ).then(() => setRefreshMatchesList(!refreshMatchesList))
                    }
                    disabled={v.player2 == null}
                  >
                    1 : 0
                  </button>
                  <button
                    className={
                      "btn join-item" +
                      (v.winner == 0 ? " btn-primary" : " btn-soft")
                    }
                    onClick={() =>
                      SetWinner(
                        v.game_id,
                        v.round,
                        v.match,
                        v.winner == 0 ? null : 0
                      ).then(() => setRefreshMatchesList(!refreshMatchesList))
                    }
                    disabled={v.player2 == null}
                  >
                    0.5 : 0.5
                  </button>
                  <button
                    className={
                      "btn join-item" +
                      (v.winner == -1 ? " btn-primary" : " btn-soft")
                    }
                    onClick={() =>
                      SetWinner(
                        v.game_id,
                        v.round,
                        v.match,
                        v.winner == -1 ? null : -1
                      ).then(() => setRefreshMatchesList(!refreshMatchesList))
                    }
                    disabled={v.player2 == null}
                  >
                    0 : 1
                  </button>
                </div>
                <p className="w-50 text-end my-auto">
                  {v.player2 != null ? (
                    <>
                      ({v.player2}){" "}
                      {(v as Match & { black: Player }).black.first_name +
                        " " +
                        ((v as Match & { black: Player }).black as Player)
                          .last_name}
                      {" ⬛"}
                    </>
                  ) : (
                    <>
                      {"BYE"}
                      {" ⬛"}
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
