"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { addPlayer, searchPlayer, updatePlayer } from "./actions";

export default function PlayersPage() {
  const [error, setError] = useState<null | string>(null);
  const [formData, setFormDate] = useState<FormData>();
  const [players, setPlayers] = useState<
    {
      rating: number;
      id: number;
      birth_year: number;
      first_name: string;
      last_name: string;
      attendant: boolean;
    }[]
  >([]);

  useEffect(() => {
    searchPlayer(formData ?? null).then((v) => {
      setPlayers(v);
    });
  }, [formData]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      if (formData.get("firstName")?.toString().length == 0) {
        setError("First name is empty!");
      } else if (formData.get("lastName")?.toString().length == 0) {
        setError("Last name is empty!");
      } else if (
        Number.parseInt(formData.get("birthYear")?.toString() ?? "-1") < 1900 ||
        Number.parseInt(formData.get("birthYear")?.toString() ?? "-1") >
          new Date().getFullYear() ||
        formData.get("birthYear")?.toString() == ""
      ) {
        setError("Birth year not valid!");
      } else if (
        Number.parseInt(formData.get("rating")?.toString() ?? "-1") < 1200 ||
        Number.parseInt(formData.get("rating")?.toString() ?? "-1") > 3000
      ) {
        setError("Rating not valid!");
      } else {
        const result = await addPlayer(formData);
        setError(result);
        if (result == null) {
          document.getElementById("formRst")?.click();
        }
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      ["firstName", "lastName", "birthYear"].includes(
        (event.target as HTMLInputElement).name
      )
    )
      setFormDate(new FormData(event.currentTarget));
  }

  return (
    <>
      <form onSubmit={onSubmit} onInput={onChange}>
        <div className="card bg-base-300 shadow-sm m-5">
          <div className="card-body">
            <h2 className="card-title">Search/Add player</h2>
            <div className="flex flex-wrap">
              <label className="floating-label my-2 me-2">
                <span>First name</span>
                <input
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  className="input input-md"
                />
              </label>
              <label className="floating-label my-2 me-2">
                <span className="bg-secondary">Last name</span>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  className="input input-md"
                />
              </label>
              <label className="floating-label my-2 me-2">
                <span>Birth year</span>
                <input
                  name="birthYear"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear()}
                  placeholder="Birth year"
                  className="input input-md"
                />
              </label>
              <div className="divider divider-horizontal" />
              <label className="floating-label my-2 me-2">
                <span>Rating</span>
                <input
                  name="rating"
                  type="number"
                  min={1200}
                  max={3000}
                  defaultValue={1200}
                  placeholder="Rating"
                  className="input input-md"
                />
              </label>
              <label className="fieldset-label my-2 me-2  ">
                <input
                  name="attendant"
                  type="checkbox"
                  className="checkbox checkbox-success"
                />
                Attendant
              </label>
            </div>
            <div className="">
              <button type="submit" className="btn btn-primary me-2">
                Add
              </button>
              <button
                id="formRst"
                type="reset"
                className="btn btn-ghost "
                onClick={() => {
                  setError(null);
                  searchPlayer(null).then((v) => setPlayers(v));
                }}
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
      <div className="min-w-4/6">
        {players.length != 0 && (
          <ul className="list  rounded-box bg-secondary max-h-100 overflow-auto">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              Players
            </li>
            {players.map((p) => {
              return (
                <li key={p.id} className="list-row">
                  <div>
                    <div>
                      {p.first_name} {p.last_name} ({p.id})
                    </div>
                    <div className="text-xs uppercase font-semibold opacity-60">
                      {p.birth_year}
                    </div>
                  </div>

                  <div>{p.rating}</div>
                  <div>
                    <label className="fieldset-label my-2 me-2  ">
                      <input
                        name="attendant"
                        type="checkbox"
                        className="checkbox checkbox-success"
                        checked={p.attendant}
                        onChange={(e) => {
                          updatePlayer(p.id, { attendant: !p.attendant }).then(
                            () => {
                              searchPlayer(formData ?? null).then((v) =>
                                setPlayers(v)
                              );
                            }
                          );
                        }}
                      />
                      Attendant
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
