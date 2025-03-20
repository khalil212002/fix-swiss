"use client";

import { useEffect, useState } from "react";
import { GetGames } from "../games/actions";
import { GetMatches, Pair, SetWinner } from "./actions";
import { Match, Player } from "@prisma/client";

export default function MatchesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [refreshGameList, setRefreshGameList] = useState(false);
  const [round, setRound] = useState(1);
  const [matches, setMatches] = useState<Match[]>([]);
  useEffect(() => {
    GetGames().then((v) => setGames(v));
  }, [refreshGameList]);
  useEffect(() => {
    game?.id &&
      GetMatches(game.id, round).then((v) => {
        setMatches(v);
      });
  }, [game, round]);

  async function pair() {
    await Pair(game!.id!, round);
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
              Players: {game?.player_count}
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
            <button className="btn mx-1 btn-primary btn-lg" onClick={pair}>
              Pair
            </button>
            <button
              className="btn mx-1 btn-secondary"
              disabled={round == game.rounds}
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
              <li className="flex justify-evenly list-row" key={v.game_id}>
                <p className=" w-50">
                  ⬜
                  {((v as any).white as Player).first_name +
                    " " +
                    ((v as any).white as Player).last_name}{" "}
                  ({v.player1})
                </p>
                <div className="join">
                  <button
                    className={
                      "btn btn-accent join-item" +
                      (v.winner == 1 ? " btn-primary" : "")
                    }
                    onClick={() => SetWinner(v.game_id, v.round, v.match, 1)}
                  >
                    1 : 0
                  </button>
                  <button
                    className={
                      "btn btn-accent join-item" +
                      (v.winner == 0 ? " btn-primary" : "")
                    }
                  >
                    0.5 : 0.5
                  </button>
                  <button
                    className={
                      "btn btn-accent join-item" +
                      (v.winner == -1 ? " btn-primary" : "")
                    }
                  >
                    0 : 1
                  </button>
                </div>
                <p className="w-50 text-end">
                  ({v.player2}){" "}
                  {((v as any).black as Player).first_name +
                    " " +
                    ((v as any).black as Player).last_name}
                  ⬛
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
