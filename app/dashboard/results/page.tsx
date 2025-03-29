"use client";

import { Game } from "@prisma/client";
import { useEffect, useState } from "react";
import { GetGames } from "../games/actions";
import { GetResults } from "./action";

export default function ResultsPage() {
  const [games, setGames] = useState<
    (Game & { _count: { players: number } })[]
  >([]);
  const [game, setGame] = useState<
    (Game & { _count: { players: number } }) | null
  >(null);
  const [results, setResults] = useState<
    { name: string; score: number; SB_score: number }[]
  >([]);
  const [refreshGameList, setRefreshGameList] = useState(false);
  useEffect(() => {
    GetGames().then((v) => {
      setGames(v);
    });
  }, [refreshGameList]);

  useEffect(() => {
    if (game) GetResults(game.id).then((v) => setResults(v));
    else setResults([]);
  }, [game]);

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
      </div>

      {results.length != 0 && (
        <div className="overflow-x-auto min-w-2/3 rounded-box border border-base-content/5 bg-base-200">
          <table className="table ">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <button className="btn btn-ghost btn-xs">refresh</button>
                </th>
                <th>Player</th>
                <th>Score</th>
                <th>SB Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                return (
                  <>
                    <tr>
                      <th>{i + 1}</th>
                      <th>{r.name}</th>
                      <th>{r.score}</th>
                      <th>{r.SB_score}</th>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
