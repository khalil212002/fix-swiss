import { useContext, useEffect, useState } from "react";
import { GetGamesList } from "./actions";
import { GamesListContext } from "./page";

export function GameSelect() {
  const { gameList, setGameList } = useContext(GamesListContext);
  return (
    <select
      defaultValue="-1"
      onClick={() => {
        GetGamesList().then((v) => {
          setGameList(v);
        });
      }}
      name="game"
      className="select w-50 my-2 me-2"
    >
      <option key={-1} value={-1}>
        Game/Group
      </option>
      {gameList.map((g) => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ))}
    </select>
  );
}
