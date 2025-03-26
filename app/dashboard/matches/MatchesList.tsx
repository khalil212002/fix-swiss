import { Match, Player } from "@prisma/client";
import WinnerButtons from "./WinnerButtons";

export default function MatchesList({
  matches,
  refreshMatchesList,
}: {
  matches: Match[];
  refreshMatchesList: () => void;
}) {
  return (
    <ul className="list mt-3 bg-secondary rounded-box shadow-md">
      {matches.map((v) => (
        <li className="flex justify-evenly list-row" key={v.match}>
          <p className=" w-50 my-auto">
            {"⬜ "}
            {((v as Match & { white: Player }).white as Player).first_name +
              " " +
              ((v as Match & { white: Player }).white as Player).last_name}{" "}
            ({v.player1})
          </p>
          <WinnerButtons
            match={v}
            refreshMatchList={() => refreshMatchesList}
          />
          <p className="w-50 text-end my-auto">
            {v.player2 != null ? (
              <>
                ({v.player2}){" "}
                {(v as Match & { black: Player }).black.first_name +
                  " " +
                  ((v as Match & { black: Player }).black as Player).last_name}
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
  );
}
