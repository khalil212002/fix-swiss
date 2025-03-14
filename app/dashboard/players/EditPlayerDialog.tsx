import { useEffect, useState } from "react";
import { deletePlayer, updatePlayer } from "./actions";

export default function EditPlayerDialog({
  player,
  toggleUpdatePlayers,
  setPlayer,
}: {
  player: Player;
  setPlayer: (player: Player | undefined) => void;
  toggleUpdatePlayers: () => void;
}) {
  const [editPlayer, setEditPlayer] = useState(player);
  useEffect(() => {
    setEditPlayer(player);
    (
      document.getElementById("edit_player_modal") as HTMLDialogElement
    ).showModal();
  }, [player]);
  return (
    <>
      <dialog id="edit_player_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">
            Edit player {editPlayer?.id}
          </h3>
          <div className="flex">
            <label className="floating-label my-2 me-2">
              <span>First name</span>
              <input
                name="firstName"
                type="text"
                placeholder="First name"
                defaultValue={editPlayer?.first_name}
                className="input input-md"
                onChange={(e) => {
                  const p = { ...editPlayer };
                  p.first_name = e.target.value;
                  setEditPlayer(p);
                }}
              />
            </label>
            <label className="floating-label my-2 me-2">
              <span className="bg-secondary">Last name</span>
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                className="input input-md"
                defaultValue={editPlayer?.last_name}
                onChange={(e) => {
                  const p = { ...editPlayer };
                  p.last_name = e.target.value;
                  setEditPlayer(p);
                }}
              />
            </label>
            <label className="floating-label my-2 me-2">
              <span>Birth year</span>
              <input
                name="birthYear"
                defaultValue={editPlayer?.birth_year}
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                placeholder="Birth year"
                className="input input-md"
                onChange={(e) => {
                  const p = { ...editPlayer };
                  p.birth_year = Number.parseInt(e.target.value);
                  setEditPlayer(p);
                }}
              />
            </label>
            <label className="floating-label my-2 me-2">
              <span>Rating</span>
              <input
                name="rating"
                type="number"
                min={1200}
                max={3000}
                placeholder="Rating"
                defaultValue={editPlayer?.rating}
                className="input input-md"
                onChange={(e) => {
                  const p = { ...editPlayer };
                  p.rating = Number.parseInt(e.target.value);
                  setEditPlayer(p);
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
                  deletePlayer(editPlayer?.id ?? -1).then(() => {
                    toggleUpdatePlayers();
                    setPlayer(undefined);
                  });
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary mx-1"
                onClick={() => setPlayer(undefined)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary mx-1"
                onClick={() => {
                  if (editPlayer)
                    updatePlayer(editPlayer).then(() => {
                      toggleUpdatePlayers();
                      setPlayer(undefined);
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
