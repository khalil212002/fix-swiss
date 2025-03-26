import { Match } from "@prisma/client";
import { SetWinner } from "./actions";

export default function WinnerButtons({
  match,
  refreshMatchList,
}: {
  match: Match;
  refreshMatchList: () => void;
}) {
  return (
    <div className="join">
      <button
        className={
          "btn join-item" + (match.winner == 1 ? " btn-primary" : " btn-soft")
        }
        onClick={() =>
          SetWinner(
            match.game_id,
            match.round,
            match.match,
            match.winner == 1 ? null : 1
          ).then(() => refreshMatchList())
        }
        disabled={match.player2 == null}
      >
        1 : 0
      </button>
      <button
        className={
          "btn join-item" + (match.winner == 0 ? " btn-primary" : " btn-soft")
        }
        onClick={() =>
          SetWinner(
            match.game_id,
            match.round,
            match.match,
            match.winner == 0 ? null : 0
          ).then(() => refreshMatchList())
        }
        disabled={match.player2 == null}
      >
        0.5 : 0.5
      </button>
      <button
        className={
          "btn join-item" + (match.winner == -1 ? " btn-primary" : " btn-soft")
        }
        onClick={() =>
          SetWinner(
            match.game_id,
            match.round,
            match.match,
            match.winner == -1 ? null : -1
          ).then(() => refreshMatchList())
        }
        disabled={match.player2 == null}
      >
        0 : 1
      </button>
    </div>
  );
}
