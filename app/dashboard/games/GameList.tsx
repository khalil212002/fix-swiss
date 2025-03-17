import { useEffect, useState } from "react";
import { GetGames } from "./actions";

export default function GameList({
  updated,
  update,
  setEditGame,
}: {
  updated: boolean;
  update: () => void;
  setEditGame: (game: Game | null) => void;
}) {
  const [games, setGames] = useState<Game[]>([]);
  useEffect(() => {
    GetGames().then((v) => setGames(v));
  }, [updated]);
  return (
    <ul className="list bg-secondary rounded-box shadow-md min-w-2/6">
      <li
        key={"head"}
        className="p-4 pb-2 text-xs flex justify-between content-center opacity-60 tracking-wide"
      >
        <button className="text-xs">Game</button>
        <button className="btn btn-xs btn-ghost" onClick={() => update()}>
          refresh
        </button>
      </li>
      {games.map((g) => (
        <li
          className="list-row flex flex-row justify-between text-center"
          key={g.id}
        >
          <div>
            <div>
              {g.name}({g.id})
            </div>
            <div className="text-xs uppercase font-semibold opacity-60">
              {g.description}
            </div>
          </div>
          <div>Rounds:{g.rounds}</div>
          <div>players:{g.player_count}</div>
          <button className="btn btn-link" onClick={() => setEditGame(g)}>
            edit
          </button>
        </li>
      ))}
    </ul>
  );
}
