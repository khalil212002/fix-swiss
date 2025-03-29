"use client";

import { FormEvent, useState } from "react";
import GameList from "./GameList";
import { CreateGame } from "./actions";
import EditGameDailog from "./EditGameDialog";
import { Game } from "@prisma/client";

export default function Games_page() {
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await CreateGame(new FormData(e.currentTarget));
    setError(result);
    if (result == null) {
      setUpdateList(!updateList);
      document.getElementById("formRst")?.click();
    }
  };
  const [error, setError] = useState<string | null>(null);
  const [updateList, setUpdateList] = useState(false);
  const [editGame, setEditGame] = useState<
    (Game & { _count: { players: number } }) | null
  >(null);

  return (
    <>
      <form onSubmit={submit}>
        <div className="card bg-base-300 shadow-sm m-5">
          <div className="card-body">
            <h2 className="card-title">Create game</h2>
            <div className="flex flex-wrap">
              <label className="floating-label my-2 me-2">
                <span>Name</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="input input-md"
                />
              </label>
              <label className="floating-label my-2 me-2">
                <span>Rounds</span>
                <input
                  name="rounds"
                  type="number"
                  min={1}
                  placeholder="Rounds"
                  className="input input-md"
                />
              </label>
              <label className="floating-label my-2 me-2">
                <span className="bg-secondary">description</span>
                <input
                  name="description"
                  type="text"
                  placeholder="Description"
                  className="input input-md"
                />
              </label>
            </div>
            <div className="">
              <button type="submit" className="btn btn-primary me-2">
                Add
              </button>
              <button
                id="formRst"
                type="reset"
                onClick={() => setError(null)}
                className="btn btn-ghost "
              >
                Clear
              </button>
            </div>
            {error && (
              <div role="alert" className="alert alert-error mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </form>
      <GameList
        updated={updateList}
        update={() => {
          setUpdateList(!updateList);
        }}
        setEditGame={setEditGame}
      />
      {editGame && (
        <EditGameDailog
          game={editGame}
          setGame={setEditGame}
          updateList={() => {
            setUpdateList(!updateList);
          }}
        />
      )}
    </>
  );
}
