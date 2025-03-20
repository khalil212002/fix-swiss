import { ChangeEvent, useContext } from "react";
import { GetGamesList } from "./actions";
import { GamesListContext } from "./page";

export function GameSelect({
  onChange,
  defaultValue,
}: {
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  defaultValue: string;
}) {
  const { gameList, setGameList } = useContext(GamesListContext);

  return (
    <select
      defaultValue={defaultValue}
      onClick={() => {
        GetGamesList().then((v) => {
          setGameList(v);
        });
      }}
      name="game"
      className="select w-50 my-2 me-2"
      onChange={onChange}
    >
      <option key={-1} value={-1}>
        Game/Group
      </option>
      {gameList.map((g) => (
        <option
          key={g.id}
          value={g.id}
          selected={g.id?.toString() == defaultValue}
        >
          {g.name}
        </option>
      ))}
    </select>
  );
}
