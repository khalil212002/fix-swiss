import { useEffect, useState } from "react";
import { DeleteGame, UpdateGame } from "./actions";
import { Game } from "@prisma/client";

export default function EditGameDailog({
  game,
  setGame,
  updateList,
}: {
  game: { game: Game; player_count: number };
  setGame: (game: { game: Game; player_count: number } | null) => void;
  updateList: () => void;
}) {
  const [editGame, setEditGame] = useState<{
    game: Game;
    player_count: number;
  } | null>(game);
  useEffect(() => {
    setEditGame(game);
    (
      document.getElementById("edit_game_modal") as HTMLDialogElement
    ).showModal();
  }, [game]);

  return (
    <>
      <dialog id="edit_game_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">
            Edit game {editGame?.game.id}
          </h3>
          <div className="flex">
            <label className="floating-label my-2 me-2">
              <span>Name</span>
              <input
                name="name"
                type="text"
                placeholder="Name"
                defaultValue={editGame?.game.name}
                className="input input-md"
                onChange={(e) => {
                  const p = { ...editGame! };
                  p.game!.name = e.target.value;
                  setEditGame(p);
                }}
              />
            </label>
            <label className="floating-label my-2 me-2">
              <span className="bg-secondary">Description</span>
              <input
                name="description"
                type="text"
                placeholder="Last name"
                className="input input-md"
                defaultValue={editGame?.game.description ?? ""}
                onChange={(e) => {
                  const p = { ...editGame! };
                  p.game!.description = e.target.value;
                  setEditGame(p);
                }}
              />
            </label>
            <label className="floating-label my-2 me-2">
              <span>Rounds</span>
              <input
                name="rounds"
                defaultValue={editGame?.game.rounds}
                type="number"
                min={1}
                placeholder="Birth year"
                className="input input-md"
                onChange={(e) => {
                  const p = { ...editGame! };
                  p.game!.rounds = Number.parseInt(e.target.value);
                  setEditGame(p);
                }}
              />
            </label>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                type="button"
                className="btn btn-error mx-1"
                onClick={() => {
                  DeleteGame(editGame?.game.id ?? -1).then(() => {
                    updateList();
                    setGame(null);
                  });
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary mx-1"
                onClick={() => setGame(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary mx-1"
                onClick={() => {
                  if (editGame)
                    UpdateGame(editGame.game).then(() => {
                      updateList();
                      setGame(null);
                    });
                }}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
